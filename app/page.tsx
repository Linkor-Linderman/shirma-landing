import { AppWindow } from "@/components/app-window";
import { CtaLink } from "@/components/cta-link";
import { FaqList } from "@/components/faq-list";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CheckIcon, CloudIcon, LockIcon, MaskIcon, ReturnIcon, TableIcon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { ScrollDepth } from "@/components/scroll-depth";
import {
  audience,
  beforeAfter,
  faq,
  familiar,
  hero,
  howItWorks,
  security,
  stage,
} from "@/lib/content";
import { submissionsEnabled } from "@/lib/site";

const stepIcons = [TableIcon, MaskIcon, CloudIcon, ReturnIcon];

export default function HomePage() {
  return (
    <>
      <Header ctaHref="#form" />
      <main id="content" tabIndex={-1}>
        <section className="section hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div>
              <h1 id="hero-title">{hero.title}</h1>
              <p className="lede">{hero.subtitle}</p>
              <div className="hero-actions">
                <CtaLink href="#form" className="btn btn-primary hero-cta" location="hero">
                  {hero.cta}
                </CtaLink>
                <p className="fine">{hero.note}</p>
              </div>
            </div>
            <AppWindow />
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="familiar-title">
          <div className="container">
            <h2 className="section-title" id="familiar-title">{familiar.title}</h2>
            <div className="card-grid">
              {familiar.items.map((item) => (
                <article className="card pain" key={item}>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="compare-title">
          <div className="container">
            <h2 className="section-title" id="compare-title">{beforeAfter.title}</h2>
            <p className="section-kicker">{beforeAfter.caption}</p>
            <div className="compare">
              <figure className="compare-col">
                <figcaption className="compare-head">
                  <LockIcon />
                  {beforeAfter.localTitle}
                </figcaption>
                <table className="data-table">
                  <caption className="visually-hidden">Пример исходных значений, они остаются на компьютере</caption>
                  <tbody>
                    {beforeAfter.rows.map((row) => (
                      <tr key={row.field}>
                        <th scope="row">{row.field}</th>
                        <td>{row.raw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
              <div className="compare-rule" aria-hidden="true">
                <span className="compare-arrow">→</span>
              </div>
              <figure className="compare-col">
                <figcaption className="compare-head">{beforeAfter.cloudTitle}</figcaption>
                <table className="data-table">
                  <caption className="visually-hidden">Те же поля в виде масок, только они уходят в облако</caption>
                  <tbody>
                    {beforeAfter.rows.map((row) => (
                      <tr key={row.field}>
                        <th scope="row">{row.field}</th>
                        <td>
                          <span className="mask">{row.mask}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            </div>
          </div>
        </section>

        <div id="how" data-depth="how_it_works">
        <section className="section section-alt" aria-labelledby="how-title">
          <div className="container">
            <h2 className="section-title" id="how-title">{howItWorks.title}</h2>
            <ol className="steps">
              {howItWorks.steps.map((step, index) => {
                const Icon = stepIcons[index] ?? TableIcon;
                return (
                  <li className="step" key={step}>
                    <Icon />
                    <span className="step-num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{step}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
          <section className="band" aria-labelledby="boundary-title">
            <div className="container">
              <h3 id="boundary-title">{howItWorks.boundaryTitle}</h3>
              <div className="boundary">
                <article className="boundary-local" aria-labelledby="stays-label">
                  <p className="boundary-label" id="stays-label">{howItWorks.staysLabel}</p>
                  <ul>
                    {howItWorks.stays.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <div className="boundary-line" aria-hidden="true" />
                <article className="boundary-cloud" aria-labelledby="leaves-label">
                  <p className="boundary-label" id="leaves-label">{howItWorks.leavesLabel}</p>
                  <ul>
                    {howItWorks.leaves.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>
        </div>

        <section className="section" aria-labelledby="security-title">
          <div className="container">
            <h2 className="section-title" id="security-title">{security.title}</h2>
            <ul className="security-list">
              {security.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="badge">
              <CheckIcon />
              {security.badge}
            </p>
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="audience-title">
          <div className="container">
            <h2 className="section-title" id="audience-title">{audience.title}</h2>
            <p className="audience-body">{audience.body}</p>
          </div>
        </section>

        <section className="section" aria-labelledby="stage-title">
          <div className="container">
            <h2 className="section-title" id="stage-title">{stage.title}</h2>
            <article className="card stage-card">
              <p>{stage.body}</p>
            </article>
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="faq-title">
          <div className="container">
            <h2 className="section-title" id="faq-title">{faq.title}</h2>
            <FaqList />
          </div>
        </section>

        <section className="section" id="form" data-depth="form" aria-labelledby="form-title">
          <div className="container">
            <h2 className="section-title" id="form-title">Запишитесь на 20 минут</h2>
            <LeadForm submissionsOpen={submissionsEnabled()} />
          </div>
        </section>
      </main>
      <Footer />
      <ScrollDepth />
    </>
  );
}
