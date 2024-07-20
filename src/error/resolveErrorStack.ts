// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 限制只追溯10个
const STACKTRACE_LIMIT = 10;

// 解析每一行
export function parseStackLine(line: string) {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {};
  const filename = lineMatch[2];
  const functionName = lineMatch[1] || "";
  const row = parseInt(lineMatch[3], 10) || undefined;
  const col = parseInt(lineMatch[4], 10) || undefined;
  return {
    filename,
    functionName,
    row,
    col,
  };
}

//解析错误堆栈
export function resolveErrorStack(error: Error) {
  const { stack } = error;
  if (!stack) return;
  const errorStacks: any[] = [];
  for (const line of stack.split("\n").slice(1)) {
    const errorStack = parseStackLine(line);
    if (errorStack) {
      errorStacks.push(errorStack);
    }
  }

  return errorStacks.slice(0, STACKTRACE_LIMIT);
}
