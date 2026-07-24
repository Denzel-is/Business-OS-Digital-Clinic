import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/contact/contact-form";

describe("contact form", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits only bounded consented fields and clears the form", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ accepted: true }), {
        headers: { "Content-Type": "application/json" },
        status: 202,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm turnstileSiteKey={undefined} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Имя" }), {
      target: { value: "Тестовый пользователь" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "contact@example.test" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Что нужно разобрать" }), {
      target: { value: "Нужно проверить маршрут обработки входящих заявок." },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Отправить обращение" }));

    await expect(
      screen.findByText("Обращение принято. Я свяжусь с вами после первичного разбора."),
    ).resolves.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({
      consent: true,
      email: "contact@example.test",
      message: "Нужно проверить маршрут обработки входящих заявок.",
      name: "Тестовый пользователь",
      turnstileToken: "",
      website: "",
    });
    expect(screen.getByRole("textbox", { name: "Имя" })).toHaveValue("");
  });

  it("does not call the API without explicit consent", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm turnstileSiteKey={undefined} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Имя" }), {
      target: { value: "Тест" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "contact@example.test" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Что нужно разобрать" }), {
      target: { value: "Достаточно длинное описание задачи для первичного разбора." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить обращение" }));

    await waitFor(() =>
      expect(screen.getByText("Для отправки необходимо явное согласие.")).toBeInTheDocument(),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
