import type {Metadata} from "next";import {DinnerCase} from "@/components/Cases";import {CaseShell} from "@/components/CaseShell";
export const metadata:Metadata={title:"公司年会晚宴｜李阳 Leo",description:"从活动策划、视觉与现场执行到传播沉淀的完整品牌活动案例。"};
export default function Page(){return <CaseShell number="02" title={{cn:"公司年会晚宴",en:"Company Annual Dinner"}} backHref="/projects/brand-events"><DinnerCase/></CaseShell>}
