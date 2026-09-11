"""Reproducible metre-scale Room furniture. Run with Blender --background --python.
All meshes are authored in Blender; GLBs contain only selected asset meshes.
"""
import bpy, math, json, os
import numpy as np
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'public/room/models'
SOURCE = ROOT / 'assets/room-blender'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.scene.unit_settings.system = 'METRIC'
bpy.context.scene.unit_settings.scale_length = 1

def material(name, color, rough=.5, metal=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    return m

# One original 1K veneer atlas, with long interlocking grain, pores and broad
# heartwood variation. No texture download, repeated strip or runtime generator.
n=1024; yy,xx=np.mgrid[0:n,0:n].astype(np.float32)/n
rng=np.random.default_rng(28)
flow=yy+.015*np.sin(xx*6+yy*9)+.007*np.sin(xx*15+yy*7)
flow+=.025*np.exp(-((xx-.32)**2/.035+(yy-.58)**2/.014))*np.sin(xx*12)
grain=np.maximum(0,np.sin(flow*330+1.5*np.sin(xx*7)))**8
heart=.025*np.sin(flow*24)+.012*np.sin(flow*75+xx*2)
fine=rng.normal(0,.003,(n,n)).astype(np.float32)
tone=.66+heart-.027*grain+fine
rgba=np.ones((n,n,4),np.float32)
for i,k in enumerate((.48,.29,.17)): rgba[:,:,i]=np.clip(tone*k,0,1)
im=bpy.data.images.new('Walnut veneer • 1024',width=n,height=n)
im.pixels.foreach_set(rgba.ravel()); im.filepath_raw=str(SOURCE/'walnut-veneer.png'); im.file_format='PNG'; im.save(); im.pack()
wood=material('Oiled walnut / longitudinal veneer',(.24,.12,.055),.47)
p=wood.node_tree.nodes.get('Principled BSDF'); p.inputs['Coat Weight'].default_value=.14; p.inputs['Coat Roughness'].default_value=.4
t=wood.node_tree.nodes.new('ShaderNodeTexImage');t.image=im;wood.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color'])
metal=material('Satin charcoal / powder coat',(.043,.05,.047),.43,.65)
brass=material('Brushed champagne hardware',(.38,.27,.13),.36,.78)
rubber=material('Soft graphite feet',(.024,.027,.025),.94)
lining=material('Warm charcoal suede lining',(.062,.055,.045),.92)
glass=material('Low iron glass',(.88,.96,.94),.11)
gp=glass.node_tree.nodes.get('Principled BSDF');gp.inputs['Alpha'].default_value=.045;gp.inputs['IOR'].default_value=1.45
gp.inputs['Coat Weight'].default_value=.3
glass.surface_render_method='DITHERED'; glass.diffuse_color=(.88,.96,.94,.045)
led=material('Warm ivory diffused LED',(.95,.75,.48),.55)
lp=led.node_tree.nodes.get('Principled BSDF');lp.inputs['Emission Color'].default_value=(1,.72,.40,1);lp.inputs['Emission Strength'].default_value=.65

def finish(o,name,mat,bevel=0):
    o.name=name;bpy.context.view_layer.objects.active=o
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
    if bevel:
        b=o.modifiers.new('Crafted edge radius','BEVEL');b.width=bevel;b.segments=3
        bpy.ops.object.modifier_apply(modifier=b.name)
        for f in o.data.polygons:f.use_smooth=True
        w=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');w.keep_sharp=True;w.weight=50
        bpy.ops.object.modifier_apply(modifier=w.name)
    o.data.materials.append(mat)
    if mat==wood:
        uv=o.data.uv_layers.active or o.data.uv_layers.new()
        # Project each face onto its dominant plane: grain follows the long axis.
        dims=o.dimensions
        for face in o.data.polygons:
            ax=max(range(3),key=lambda i:abs(face.normal[i])); axes=[i for i in range(3) if i!=ax]
            if dims[axes[0]]<dims[axes[1]]:axes.reverse()
            for li in face.loop_indices:
                co=o.data.vertices[o.data.loops[li].vertex_index].co
                uv.data[li].uv=(co[axes[0]]/max(dims[axes[0]],.001)+.5,co[axes[1]]/max(dims[axes[1]],.001)+.5)
    return o

# Input coordinates use the Room convention: x right, y up, z toward viewer.
def box(name,pos,size,mat,bevel=.003):
    bpy.ops.mesh.primitive_cube_add(size=1,location=(pos[0],-pos[2],pos[1]))
    o=bpy.context.object;o.dimensions=(size[0],size[2],size[1]);return finish(o,name,mat,bevel)
def cylinder(name,pos,radius,depth,mat,vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=(pos[0],-pos[2],pos[1]))
    return finish(bpy.context.object,name,mat,.001)
def taper(name,bottom,top,bw,tw,mat):
    verts=[]
    for p,w in [(bottom,bw),(top,tw)]:
        verts += [(p[0]+sx*w[0]/2,-p[2]+sz*w[1]/2,p[1]) for sx,sz in [(-1,-1),(1,-1),(1,1),(-1,1)]]
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return finish(o,name,mat,.004)

def begin(): return set(bpy.context.scene.objects)
def grouped(before,prefix):
    objects=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH']
    # Merge only matching furniture material batches. Figures are separate assets.
    mats={o.data.materials[0] for o in objects}
    batches={mat:[o for o in objects if o.data.materials[0]==mat] for mat in mats}
    result=[]
    for mat in sorted(mats,key=lambda m:m.name):
        batch=batches[mat]
        bpy.ops.object.select_all(action='DESELECT')
        for o in batch:o.select_set(True)
        bpy.context.view_layer.objects.active=batch[0];bpy.ops.object.join();o=bpy.context.object
        bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
        o.name=prefix+' / '+mat.name;result.append(o)
    return result

# Match d55d088 exactly: main slab, right rear wing, .9855 support plane.
# This is a surface/structure upgrade, never a physical-scale normalization.
before=begin()
w,d,h,t=4.81,1.52,.798,.095
floor=.14; top_y=floor+h; leg_h=h-t; xleg=w/2-.18
box('Walnut worktop',(0,top_y,0),(w,t,d),wood,.018)
box('Rear return',(w/2-w*.24/2,top_y,-d*.63),(w*.24,t,d*.72),wood,.018)
# Existing left pedestal position and right tower bay remain clear.
drawer_x=-w/2+.53
box('Pedestal carcass',(drawer_x,floor+leg_h*.455,.05),(.92,leg_h*.91,d*.72),wood,.025)
box('Drawer dark reveal',(drawer_x,.50,d*.415-.082),(.884,.59,.017),metal,.005)
for y,index in [(floor+.145,0),(floor+.375,1),(floor+.565,2)]:
    box('Inset drawer front',(drawer_x,y,d*.415-.07),(.86,.26 if index==0 else .175,.036),wood,.006)
    box('Recessed finger rail',(drawer_x,y+(.073 if index==0 else .04),d*.415-.043),(.30,.022,.024),metal,.005)
# Refined rectangular metal frames, with rounded weld transitions and end caps.
for x in [-xleg,xleg]:
    for z in [-.48,.48]:
        box('U frame upright',(x,.529,z),(.105,.776,.105),metal,.009)
        box('Rubber isolator',(x,.1435,z),(.094,.007,.092),rubber,.002)
    box('U frame lower rail',(x,.175,0),(.105,.07,1.065),metal,.009)
    box('Under slab saddle',(x,.865,0),(.24,.05,d*.82),metal,.007)
    for z in [-.43,.43]:cylinder('Mounting bolt',(x,.833,z),.015,.012,brass,6)
box('Wing support',(xleg,.518,-1.27),(.105,.75,.105),metal,.009)
box('Wing attachment',(xleg,.865,-1.10),(.22,.05,.60),metal,.006)
box('Rear cross beam',(0,top_y-.18,-d*.38),(w*.9,.1,.08),metal,.010)
box('Cable trough',(0,top_y-.24,-d*.43),(w*.88,.08,.18),metal,.010)
for x in [-1.5,0,1.5]:box('Cable tray fixing',(x,.821,-d*.43),(.055,.18,.032),metal,.004)
# A flush machined grommet at the original cable location; no change in height.
bpy.ops.mesh.primitive_torus_add(major_segments=32,minor_segments=6,location=(0,d*.4,.9845),major_radius=.0445,minor_radius=.002)
finish(bpy.context.object,'Cable grommet rim',metal)
cylinder('Cable grommet insert',(0,.9848,-d*.4),.041,.002,rubber)
desk=grouped(before,'Desk')

# Same 1.06 x .48 x 1.66 footprint, same three shelf support heights and figures.
before=begin()
box('Shadow plinth',(0,.011,0),(.96,.022,.408),metal,.006)
box('Walnut base cabinet',(0,.145,0),(1.02,.246,.452),wood,.010)
box('Base front reveal',(0,.146,.227),(.948,.205,.009),metal,.003)
box('Framed walnut front',(0,.146,.231),(.928,.187,.014),wood,.006)
box('Champagne finger pull',(0,.217,.236),(.23,.010,.006),brass,.002)
box('Walnut back panel',(0,.98,-.229),(.948,1.32,.02),wood,.004)
for side in [-1,1]:
    for z in [-.21,.21]:box('Charcoal corner stile',(side*.502,.83,z),(.056,1.66,.06),metal,.006)
    box('Walnut side inset',(side*.49,.97,-.21),(.018,1.25,.028),wood,.003)
    box('Low iron side glass',(side*.5,.97,0),(.006,1.28,.36),glass,.001)
for i,y in enumerate([.30,.72,1.14,1.64]):
    if i==3:
        box('Walnut crown',(0,y,0),(1.06,.04,.48),wood,.008)
    else:
        for z in [-.213,.213]:box('Shelf walnut frame',(0,y,z),(.974,.04,.054),wood,.005)
        for x in [-.46,.46]:box('Shelf side frame',(x,y,0),(.044,.04,.382),wood,.004)
        box('Polished glass shelf',(0,y+.016,0),(.886,.008,.378),glass,.0015)
        for x in [-.45,.45]:
            for z in [-.17,.17]:box('Glass shelf pin',(x,y+.006,z),(.018,.009,.022),brass,.002)
    if i>0:
        box('Recessed lamp channel',(0,y-.024,.116),(.844,.01,.028),metal,.002)
        box('Warm shelf diffuser',(0,y-.030,.117),(.804,.003,.022),led,.001)
box('Clear front glazing',(0,.97,.223),(.936,1.272,.004),glass,.001)
for y in [.43,1.48]:box('Compact hinge',(-.469,y,.226),(.025,.042,.015),metal,.004)
box('Slim champagne pull',(.450,.94,.234),(.010,.13,.012),brass,.003)
cabinet=grouped(before,'Cabinet')

assets=[('leo-desk',desk),('stitch-display-cabinet',cabinet)]
stats={}
for name,objects in assets:
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
    coords=[o.matrix_world@v.co for o in objects for v in o.data.vertices]
    tris=0
    for o in objects:o.data.calc_loop_triangles();tris+=len(o.data.loop_triangles)
    stats[name]={'triangles':tris,'draws':len(objects),'sizeXYZ':[round(max(v[i] for v in coords)-min(v[i] for v in coords),5) for i in [0,2,1]],'minXYZ':[round(min(v.x for v in coords),5),round(min(v.z for v in coords),5),round(-max(v.y for v in coords),5)],'bytes':(OUT/(name+'.glb')).stat().st_size}
    col=bpy.data.collections.new(name);bpy.context.scene.collection.children.link(col)
    for o in objects:
        for c in list(o.users_collection):c.objects.unlink(o)
        col.objects.link(o)
        if name!='leo-desk':o.hide_set(True)
with open(SOURCE/'asset-manifest.json','w') as f:json.dump(stats,f,indent=2)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'room-furniture-refinement.blend'))
print('ROOM_FURNITURE_COMPLETE',json.dumps(stats))
