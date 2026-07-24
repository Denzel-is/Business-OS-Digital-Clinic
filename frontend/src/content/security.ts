export type SecurityControlStatus = "Implemented" | "Foundation" | "Planned";

export interface SecurityControl {
  code: string;
  evidence: string;
  group: "Application" | "Data" | "Edge" | "Operations";
  nextStep: string;
  status: SecurityControlStatus;
  summary: string;
  title: string;
}

export const securityControls: readonly SecurityControl[] = [
  {
    code: "VAL",
    evidence: "Bean Validation, строгие DTO и безопасная учебная симуляция.",
    group: "Application",
    nextStep: "Расширять контекстные правила вместе с реальными формами.",
    status: "Implemented",
    summary: "Входные данные проверяются по типу, размеру и контексту использования.",
    title: "Input Validation",
  },
  {
    code: "AUTHN",
    evidence: "BCrypt cost 12, единый ответ при ошибке и безопасный одноразовый bootstrap.",
    group: "Application",
    nextStep: "Добавить MFA challenge, recovery и ограничение попыток входа.",
    status: "Implemented",
    summary: "Личность администратора проверяется backend перед созданием защищённой сессии.",
    title: "Authentication",
  },
  {
    code: "AUTHZ",
    evidence: "ADMIN/EDITOR проверяются URL-правилами и @PreAuthorize на каждом admin API.",
    group: "Application",
    nextStep: "Добавлять ресурсные права вместе с будущими CRUD-операциями.",
    status: "Implemented",
    summary: "Backend проверяет роль для каждого защищённого административного запроса.",
    title: "Authorization",
  },
  {
    code: "API",
    evidence: "Версионированные DTO, Problem Details, no-store и строгие прокси-контракты.",
    group: "Application",
    nextStep: "Добавить лимиты запросов и операционные метрики на этапе 13.",
    status: "Foundation",
    summary: "API минимизирует поверхность данных и не раскрывает внутренние ошибки.",
    title: "API Security",
  },
  {
    code: "DB",
    evidence: "14 JPA-сущностей, Flyway-схема, ограничения и проверка на чистом PostgreSQL.",
    group: "Data",
    nextStep: "Добавить least-privilege роли, repositories, backup и restore-проверки.",
    status: "Foundation",
    summary: "Данные требуют ограниченных ролей, миграций, шифрования и контроля запросов.",
    title: "Database Security",
  },
  {
    code: "SESS",
    evidence: "HttpOnly session cookie, 30-минутный timeout, CSRF login/logout и ротация ID.",
    group: "Application",
    nextStep: "Добавить административный отзыв сессий и риск-сигналы.",
    status: "Implemented",
    summary: "Сессии должны иметь короткий жизненный цикл и защищённые cookie.",
    title: "Session Security",
  },
  {
    code: "RATE",
    evidence: "Redis предусмотрен, но счётчики лимитов ещё не подключены.",
    group: "Edge",
    nextStep: "Добавить лимиты по маршрутам и корректные ответы 429 на этапе 13.",
    status: "Planned",
    summary: "Лимиты снижают злоупотребления, но не заменяют edge-защиту.",
    title: "Rate Limiting",
  },
  {
    code: "BOT",
    evidence: "Ключи Turnstile описаны только как контракт окружения.",
    group: "Edge",
    nextStep: "Подключить challenge только к рискованным публичным действиям.",
    status: "Planned",
    summary: "Bot protection повышает стоимость автоматизации, не обещая полной блокировки.",
    title: "Bot Protection",
  },
  {
    code: "HDR",
    evidence: "CSP, HSTS в production, frame denial, nosniff и Permissions Policy.",
    group: "Application",
    nextStep: "Ужесточать CSP при появлении новых внешних ресурсов.",
    status: "Implemented",
    summary: "Браузерные заголовки ограничивают опасные режимы исполнения и встраивания.",
    title: "Security Headers",
  },
  {
    code: "AUDIT",
    evidence: "События пользователей и администраторов пока не существуют.",
    group: "Operations",
    nextStep: "Записывать минимальные неизменяемые события после появления админки.",
    status: "Planned",
    summary: "Аудит фиксирует кто, когда и какое значимое действие выполнил.",
    title: "Audit Logging",
  },
  {
    code: "SECRET",
    evidence: "Секреты отделены от кода через env-контракт и исключения Git.",
    group: "Operations",
    nextStep: "Использовать управляемое хранилище и ротацию при развёртывании.",
    status: "Foundation",
    summary: "Секреты не должны попадать в репозиторий, образ, браузер или логи.",
    title: "Secrets Management",
  },
  {
    code: "BACKUP",
    evidence: "Постоянные бизнес-данные ещё не введены.",
    group: "Data",
    nextStep: "Автоматизировать зашифрованные копии и проверяемое восстановление.",
    status: "Planned",
    summary: "Резервная копия считается рабочей только после теста восстановления.",
    title: "Backups",
  },
  {
    code: "MON",
    evidence: "Actuator health даёт базовый сигнал доступности backend.",
    group: "Operations",
    nextStep: "Добавить метрики, алерты, корреляцию и SLO на этапе 13.",
    status: "Foundation",
    summary: "Наблюдаемость помогает заметить отказ и злоупотребление до жалобы пользователя.",
    title: "Monitoring",
  },
  {
    code: "DEPS",
    evidence: "Lockfile, Maven Wrapper и локальные проверки зависимостей воспроизводимы.",
    group: "Operations",
    nextStep: "Закрепить автоматический аудит и политику обновлений в CI.",
    status: "Foundation",
    summary: "Зависимости требуют фиксации версий, аудита и своевременного обновления.",
    title: "Dependency Security",
  },
  {
    code: "EDGE",
    evidence: "Cloudflare описан как целевой слой, но deployment ещё не выполнен.",
    group: "Edge",
    nextStep: "Настроить CDN, WAF, TLS и закрытие прямого доступа к origin.",
    status: "Planned",
    summary: "Edge принимает объёмный трафик и фильтрует его до приложения.",
    title: "CDN and WAF",
  },
  {
    code: "IR",
    evidence: "Контакты, severity и runbook ещё не утверждены.",
    group: "Operations",
    nextStep: "Описать обнаружение, сдерживание, восстановление и разбор инцидента.",
    status: "Planned",
    summary: "Заранее определённый процесс сокращает время реакции на инцидент.",
    title: "Incident Response",
  },
] as const;

export const securityRealityChecks = [
  {
    title: "Публичное можно копировать",
    text: "Публичный контент нельзя полностью защитить от копирования: доступный браузеру материал можно сохранить или воспроизвести.",
  },
  {
    title: "Массовый scraping можно ограничивать",
    text: "Rate limiting, bot signals, кэш и поведенческие правила уменьшают масштаб массового scraping, но не дают абсолютной гарантии.",
  },
  {
    title: "Java не остановит DDoS в одиночку",
    text: "DDoS нельзя остановить только Java-приложением: перегрузка может произойти раньше, чем запрос достигнет кода.",
  },
  {
    title: "Нужны независимые слои",
    text: "Практическая защита сочетает CDN, WAF, rate limiting, monitoring и защиту origin с контролями приложения и данных.",
  },
] as const;
