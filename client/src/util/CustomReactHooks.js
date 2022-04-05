import { useEffect, useState } from "react";

export function useAsyncState(promise, dependencies = []) {
  const [value, setValue] = useState(null);
  useEffect(() => {
    promise.then((resolve) => {
      setValue(resolve);
    })
  }, [promise, ...dependencies])

  return [value, setValue];
}
