"use client";

import axios from "axios";
import * as z from "zod"; // библиотека для валидации и создания схем данных в TypeScript. Позволяет определять структуры данных, называемые схемами, и затем использовать эти схемы для валидации и преобразования данных.
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import { Heading } from "@/components/heading";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formSchema } from "./constants";
import { useState } from "react";

// Это для контроля валидации
const ConversationPage = () => {
  const router = useRouter();
  // Состояние для сообщений
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    // "<z.infer<typeof formSchema>>" - указываю тип данных, используя интерференс, полуенный из схемы данных "formSchema"
    resolver: zodResolver(formSchema),
    // Связываю с помощью "zodResolver" с схему данных "formSchema" с резольвером схемы. Это позволяет валидировать и обрабатывать данные формы на основе этой схемы.
    defaultValues: {
      prompt: "", // изначальное значение - пустая строка
    },
  });

  const isLoading = form.formState.isSubmitting; // Это для контроля состояния загрузки (определения состояния загрузки формы). "isLoading" - присваиваю "true", если св-во "isSubmitting" из объекта "formState" равно "true". Это означает, что процесс отправки формы идёт. Так делают чтобы блокировать форму во время отправки данных, чтобы пользователи знали, что происходит, и не могли повторно отправлять данные, пока процесс отправки не завершиться.

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      }; // содержит информацию о роли ("user") и содержимом сообщения, которое пользователь ввел в форме. Этот объект будет использоваться для создания запроса к API моедил чата для дополнения беседы.

      // создаю массив новых сообещний
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      }); // api folder -> conversation folder

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Modal
      console.log(error);
    } finally {
      router.refresh();
    }
  }; // Эта функция будет вызвана при отправке данных формы. "values" - определены в схеме "formSchema"

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg
              border
              w-full
              p-4
              px-3
              md:px-6
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} // "disabled" активируется когда закгрузим форму
                        placeholder="How do I calculate the redius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div key={message.content}>{message.content}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
