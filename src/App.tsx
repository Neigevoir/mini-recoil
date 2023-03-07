import "./App.css";
// import {
//   atom,
//   selector,
//   useRecoilState,
//   useRecoilValue,
//   useSetRecoilState,
// } from "recoil";
import { atom } from "./recoil/atom";
import { selector } from "./recoil/selector";
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "./recoil/hooks";

const counter = atom({
  key: "myCounter",
  default: 0,
});

const counterSelector = selector({
  key: "counterSelector",
  get: ({ get }) => {
    const value = get(counter) as number;
    return value * 10;
  },
  set: ({ set, get }) => {
    const value = get(counter) as number;
    set(counter, value + 5);
  },
});

function Test1() {
  const [count, setCount] = useRecoilState(counter);
  return <div onClick={() => setCount(1)}>Test1: {count}</div>;
}

function Test2() {
  const [count, setCount] = useRecoilState(counter);
  return <div onClick={() => setCount(2)}>Test2: {count}</div>;
}

function Test3() {
  const count = useRecoilValue(counter);
  return <div>Test3: {count}</div>;
}

function Test4() {
  const setCount = useSetRecoilState(counter);
  return <div onClick={() => setCount(4)}>Test4</div>;
}

function Test5() {
  const [conut, setCount] = useRecoilState(counterSelector);
  return <div onClick={() => setCount(8)}>Test5: {conut}</div>;
}

function Test6() {
  return <div>Test6</div>;
}

export default function App() {
  return (
    <div className="App">
      <Test1 />
      <Test2 />
      <Test3 />
      <Test4 />
      <Test5 />
      <Test6 />
    </div>
  );
}
