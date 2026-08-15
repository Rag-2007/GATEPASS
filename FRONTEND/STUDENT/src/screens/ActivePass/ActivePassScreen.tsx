import React from "react";
import { useRouter } from "expo-router";
export default function ActivePassScreen() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/apply" as never);
  }, []);
  return null;
}

