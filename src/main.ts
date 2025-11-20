import "@picocss/pico/css/pico.min.css";
import van from "vanjs-core"
import * as vanX from "vanjs-ext"
import { initialize_nexus, pay_you_bastard } from "./nexus";
import type { NexusSDK } from "@avail-project/nexus-core";

const { div, button, label } = van.tags

class AppState {
  lucky_number: number | null = null
  busy: boolean = false
}

const _state = new AppState()
const state = vanX.reactive(_state)
const nexus = await initialize_nexus()

async function core_logic(nexus: NexusSDK, state: AppState) {
  state.busy = true
  await pay_you_bastard(nexus)
  state.lucky_number = Math.floor(Math.random() * 100)
  state.busy = false
}

const LuckyNumber = (state: AppState) => () => {
  const style = "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;"
  if (state.busy) {
    return div({ style: style }, label(":spinner:"))
  }

  const pay_button = button({ onclick: () => { core_logic(nexus, state) } }, "Pay 0.01 USDC");
  const lucky_number = label(state.lucky_number == null ? "?" : +state.lucky_number);
  return div({ style: style }, lucky_number, pay_button)
}

van.add(document.body, LuckyNumber(state))

