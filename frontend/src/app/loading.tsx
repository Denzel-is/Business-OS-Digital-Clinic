import { PageState } from "@/components/foundation/page-state";

export default function Loading() {
  return (
    <PageState
      description="Подготавливаем интерфейс и необходимые данные."
      kind="loading"
      title="Загрузка"
    />
  );
}
