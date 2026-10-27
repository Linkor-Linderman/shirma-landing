import Image from "next/image";
import { beforeAfter, appWindow } from "@/lib/content";

export function AppWindow() {
  const rows = beforeAfter.rows.filter((row) =>
    row.field === "Компания" || row.field === "ИНН" || row.field === "Сумма",
  );

  return (
    <figure className="hero-visual">
      <div className="window">
        <div className="window-bar">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="window-file">{appWindow.file}</span>
        </div>
        <div className="window-body">
          <aside className="window-side">
            <Image src="/brand/mark-light.svg" alt="" width={40} height={44} unoptimized />
            <p>{appWindow.side}</p>
          </aside>
          <div className="window-main">
            <table>
              <caption className="visually-hidden">Обезличенные поля в макете окна</caption>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.field}>
                    <th scope="row">{row.field}</th>
                    <td>
                      <span className="mask">{row.mask}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <figcaption className="window-caption">{appWindow.caption}</figcaption>
    </figure>
  );
}
