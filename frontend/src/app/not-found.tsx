import { PageState } from "@/components/foundation/page-state";

export default function NotFound() {
  return (
    <PageState
      description="Запрошенная страница не существует или была перемещена."
      kind="empty"
      title="Страница не найдена"
    />
  );
}
