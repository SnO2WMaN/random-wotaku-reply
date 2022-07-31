export type Pattern = ("1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0")[];

const type7List = ["珍棒", "マンゴー", "SEX", "イク"];
const randomType7 = () => {
  return type7List[Math.floor(Math.random() * type7List.length)];
};

export const mkText = (pattern: Pattern): string => {
  const [head, ...rest] = pattern;
  if (!head) return "";
  switch (head) {
    case "1":
      return `すいません ${mkText(rest)}`;
    case "2":
      return `しかし ${mkText(rest)}`;
    case "3":
      return `これはどういうことですか？ ${mkText(rest)}`;
    case "4":
      return `あなたはオタクなのですか？ ${mkText(rest)}`;
    case "5":
      return `そのようなことはありえません ${mkText(rest)}`;
    case "6":
      return `そのような行動はオタク以外しません ${mkText(rest)}`;
    case "7":
      return `${randomType7()} ${mkText(rest)}`;
    case "8":
      return `ハァッハァッハァッ ${mkText(rest)}`;
    case "9":
      return `オタクは経済を回しています ${mkText(rest)}`;
    case "0":
      return `オタクは経済を回していません ${mkText(rest)}`;
  }
};

export const splitPattern = (raw: string): Pattern | null => {
  if (raw.length === 0) return null;
  const arr = raw.split("") as Pattern;
  if (!arr.every((c) => "1234567890".includes(c))) {
    return null;
  }
  return arr;
};
