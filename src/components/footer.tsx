import Link from "next/link";

export default function Footer() {
  return (
    <div className="p-8 text-center bg-base-300">
      <p>&copy;2024 &nbsp;
      <Link href={"https://www.hng-data.org/"} className="link link-hover">
        漢字字体規範史データセット保存会
      </Link></p>
      <p>UI開発者：劉冠偉</p>
    </div>
  );
}
