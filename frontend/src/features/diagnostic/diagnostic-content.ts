import type { DiagnosticEvaluationRequest } from "@/lib/api/contracts";

type EvaluationField = keyof DiagnosticEvaluationRequest;

interface DiagnosticOption {
  description: string;
  label: string;
  value: string;
}

export interface DiagnosticStep {
  field: EvaluationField;
  hint: string;
  options: readonly DiagnosticOption[];
  question: string;
  systemLabel: string;
}

export const diagnosticSteps: readonly DiagnosticStep[] = [
  {
    field: "businessType",
    hint: "Контекст влияет на процессы, но не используется для сравнения с другими компаниями.",
    options: [
      { description: "Магазин, e-commerce или офлайн-точки.", label: "Розница", value: "RETAIL" },
      { description: "Экспертная или клиентская услуга.", label: "Услуги", value: "SERVICES" },
      { description: "Цифровой продукт или подписка.", label: "SaaS", value: "SAAS" },
      {
        description: "Производство или операционная площадка.",
        label: "Производство",
        value: "MANUFACTURING",
      },
      { description: "Некоммерческий проект или фонд.", label: "НКО", value: "NONPROFIT" },
      { description: "Другой тип деятельности.", label: "Другое", value: "OTHER" },
    ],
    question: "Какой у вас тип бизнеса?",
    systemLabel: "Business context",
  },
  {
    field: "teamSize",
    hint: "Размер помогает оценить сложность согласований и внедрения.",
    options: [
      { description: "Работаю самостоятельно.", label: "Только я", value: "SOLO" },
      { description: "Небольшая команда.", label: "2–10", value: "TWO_TO_TEN" },
      { description: "Несколько ролей и функций.", label: "11–50", value: "ELEVEN_TO_FIFTY" },
      {
        description: "Несколько подразделений.",
        label: "51–200",
        value: "FIFTY_ONE_TO_TWO_HUNDRED",
      },
      { description: "Крупная организация.", label: "Более 200", value: "OVER_TWO_HUNDRED" },
    ],
    question: "Какой размер команды?",
    systemLabel: "Team topology",
  },
  {
    field: "primaryProblem",
    hint: "Выберите симптом, который сейчас сильнее всего влияет на работу.",
    options: [
      {
        description: "Нет гарантированного ответа и статуса.",
        label: "Заявки теряются",
        value: "LOST_LEADS",
      },
      {
        description: "Команда повторяет одни операции.",
        label: "Слишком много ручной работы",
        value: "MANUAL_WORK",
      },
      {
        description: "Пользователи не завершают целевое действие.",
        label: "Низкая конверсия",
        value: "LOW_CONVERSION",
      },
      {
        description: "Ошибки и простои мешают процессу.",
        label: "Системы нестабильны",
        value: "UNSTABLE_SYSTEMS",
      },
      {
        description: "Нет ясной картины контролей и угроз.",
        label: "Риски безопасности",
        value: "SECURITY_RISKS",
      },
      {
        description: "Интерфейс мешает клиентам или команде.",
        label: "Неудобный UX",
        value: "POOR_UX",
      },
    ],
    question: "Какая проблема главная?",
    systemLabel: "Primary symptom",
  },
  {
    field: "manualOperations",
    hint: "Оценивайте частоту, а не сложность отдельной операции.",
    options: [
      { description: "Практически отсутствует.", label: "Нет", value: "NONE" },
      { description: "Возникает время от времени.", label: "Редкая", value: "RARE" },
      { description: "Повторяется каждую неделю или день.", label: "Регулярная", value: "REGULAR" },
      {
        description: "Занимает значительную часть работы.",
        label: "Доминирует",
        value: "DOMINANT",
      },
    ],
    question: "Сколько ручных операций?",
    systemLabel: "Manual load",
  },
  {
    field: "existingSystems",
    hint: "Важно, как данные и ответственность переходят между инструментами.",
    options: [
      { description: "Данные и статусы связаны.", label: "Интегрированы", value: "INTEGRATED" },
      {
        description: "Связаны только ключевые участки.",
        label: "Частично связаны",
        value: "PARTIAL",
      },
      {
        description: "Таблицы, чаты и сервисы живут отдельно.",
        label: "Разрознены",
        value: "FRAGMENTED",
      },
      { description: "Процесс пока не оформлен в системах.", label: "Систем нет", value: "NONE" },
    ],
    question: "Как устроены существующие системы?",
    systemLabel: "System landscape",
  },
  {
    field: "digitalProduct",
    hint: "Ответ не означает, что продукт обязательно нужно переписывать.",
    options: [
      {
        description: "Поддерживается и решает основные задачи.",
        label: "Современный",
        value: "MODERN",
      },
      { description: "Накопил UX и технические ограничения.", label: "Устарел", value: "OUTDATED" },
      {
        description: "Ошибки и простои влияют на пользователей.",
        label: "Нестабилен",
        value: "UNSTABLE",
      },
      { description: "Сайта или приложения пока нет.", label: "Продукта нет", value: "NONE" },
    ],
    question: "Каково состояние сайта или приложения?",
    systemLabel: "Digital product",
  },
  {
    field: "leadHandling",
    hint: "Речь о назначении ответственного, статусе и контроле времени ответа.",
    options: [
      {
        description: "Есть правила и контроль статусов.",
        label: "Автоматизировано",
        value: "AUTOMATED",
      },
      { description: "Некоторые этапы автоматизированы.", label: "Частично", value: "PARTIAL" },
      { description: "Назначение и статусы ведёт человек.", label: "Вручную", value: "MANUAL" },
      { description: "Единого процесса нет.", label: "Хаотично", value: "CHAOTIC" },
    ],
    question: "Как обрабатываются заявки?",
    systemLabel: "Lead handling",
  },
  {
    field: "analytics",
    hint: "Оценивается доступность сигналов для принятия решения, а не количество отчётов.",
    options: [
      {
        description: "Ключевые сигналы доступны своевременно.",
        label: "Оперативная",
        value: "REAL_TIME",
      },
      {
        description: "Есть базовые отчёты по основным событиям.",
        label: "Базовая",
        value: "BASIC",
      },
      { description: "Данные собираются вручную.", label: "Ручные отчёты", value: "MANUAL" },
      { description: "Согласованных метрик нет.", label: "Аналитики нет", value: "NONE" },
    ],
    question: "Как устроена аналитика?",
    systemLabel: "Observability",
  },
  {
    field: "aiUsage",
    hint: "Отсутствие ИИ само по себе не ухудшает оценку.",
    options: [
      { description: "Не используем и пока не требуется.", label: "Не используем", value: "NONE" },
      {
        description: "Проверяем отдельные сценарии.",
        label: "Эксперименты",
        value: "EXPERIMENTING",
      },
      {
        description: "Есть управляемый рабочий сценарий.",
        label: "Встроен в процесс",
        value: "EMBEDDED",
      },
      {
        description: "Нет правил по данным и проверке ответов.",
        label: "Без контроля",
        value: "UNCONTROLLED",
      },
    ],
    question: "Как используется ИИ?",
    systemLabel: "AI usage",
  },
  {
    field: "personalData",
    hint: "Не указывайте сами данные — только общий уровень обработки.",
    options: [
      { description: "Персональные данные не обрабатываются.", label: "Нет", value: "NONE" },
      { description: "Минимальные контактные данные.", label: "Ограниченно", value: "LIMITED" },
      {
        description: "Обрабатываются в регулярном процессе.",
        label: "Регулярно",
        value: "REGULAR",
      },
      {
        description: "Есть чувствительные или критичные категории.",
        label: "Чувствительные",
        value: "SENSITIVE",
      },
    ],
    question: "Обрабатываются ли персональные данные?",
    systemLabel: "Data sensitivity",
  },
  {
    field: "expectedResult",
    hint: "Результат нужен для приоритизации рекомендации, а не для обещания эффекта.",
    options: [
      {
        description: "Сократить повторяющиеся действия.",
        label: "Экономия времени",
        value: "SAVE_TIME",
      },
      {
        description: "Устранить потери в клиентском пути.",
        label: "Рост выручки",
        value: "GROW_REVENUE",
      },
      {
        description: "Сделать путь понятнее и доступнее.",
        label: "Лучший опыт",
        value: "IMPROVE_EXPERIENCE",
      },
      {
        description: "Снизить операционные и security-риски.",
        label: "Снижение риска",
        value: "REDUCE_RISK",
      },
      {
        description: "Получать своевременные сигналы.",
        label: "Прозрачность",
        value: "GAIN_VISIBILITY",
      },
    ],
    question: "Какой результат ожидается?",
    systemLabel: "Expected outcome",
  },
] as const;
