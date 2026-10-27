/** Публикация включена только явным SITE_PUBLIC=true. Любое другое значение — закрытый режим. */
export function isSitePublic(): boolean {
  return process.env.SITE_PUBLIC === "true";
}

/**
 * Заявки уходят в LeadSink только когда страница публичная и задан ключ.
 * Иначе форма остаётся на странице, но данные не отправляются.
 * Значение вшивается в статическую страницу при сборке: после смены переменных нужен новый build.
 * Сам route handler проверяет переменные уже во время запроса.
 */
export function submissionsEnabled(): boolean {
  const key = process.env.LOOPS_API_KEY;
  return isSitePublic() && typeof key === "string" && key.trim().length > 0;
}
