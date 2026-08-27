import { redirect } from "next/navigation";

export default function MyWorldRoute() {
  redirect("/other-side/world");
}
