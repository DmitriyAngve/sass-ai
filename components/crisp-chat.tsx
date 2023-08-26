"use client";

import { useEffect } from "react";

import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("b05e8711-3740-47dc-8a4e-cfdbabc62fb7"); // эта строка настраивает Crisp с помощью указанного идентификатора, который выдался при создании учетной записи Crisp
  }, []); // "useEffect" использует только для монтирования компонента, потому что массив зависимостей остается пустым

  return null;
};
