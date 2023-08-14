"use client";

import * as z from "zod"; // библиотека для валидации и создания схем данных в TypeScript. Позволяет определять структуры данных, называемые схемами, и затем использовать эти схемы для валидации и преобразования данных.
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";

const ConversationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    // "<z.infer<typeof formSchema>>" - указываю тип данных, используя интерференс, полуенный из схемы данных "formSchema"
    resolver: zodResolver(formSchema),
    // Связываю с помощью "zodResolver" с схему данных "formSchema" с резольвером схемы. Это позволяет валидировать и обрабатывать данные формы на основе этой схемы.
    defaultValues: {
      prompt: "", // изначальное значение - пустая строка
    },
  });

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8"></div>
    </div>
  );
};

export default ConversationPage;
