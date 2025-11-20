import "@picocss/pico/css/pico.min.css";
import van from "vanjs-core"
import * as vanX from "vanjs-ext"
import { initialize_nexus, pay_you_bastard } from "./nexus";
import type { NexusSDK } from "@avail-project/nexus-core";

const { div, button, label } = van.tags

let nexus_api: NexusSDK | null = null

class AppState {
  lucky_number: number | null = null
  busy: boolean = false
  error: string | null = null
  loading: boolean = true
}
const _state = new AppState()
const state = vanX.reactive(_state)

async function core_logic(state: AppState) {
  if (nexus_api == null) {
    throw "ups"
  }

  state.busy = true
  await pay_you_bastard(nexus_api)
  state.lucky_number = Math.floor(Math.random() * 100)
  state.busy = false
}

const LuckyNumber = (state: AppState) => () => {
  const style = "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;"
  if (state.error != null) {
    return div({ style: style }, label(state.error))
  }

  if (state.loading == true) {
    return div({ style: style }, label("Nexus Initializing..."))
  }

  if (state.busy) {
    return div({ style: style }, label(":spinner:"))
  }

  const pay_button = button({ onclick: () => { core_logic(state) } }, "Pay 0.01 USDC");
  const lucky_number = label(state.lucky_number == null ? "?" : +state.lucky_number);
  return div({ style: style }, lucky_number, pay_button)
}

van.add(document.body, LuckyNumber(state))

const nexus = await initialize_nexus()
if (typeof nexus == "string") {
  state.error = nexus
} else {
  nexus_api = nexus
}
state.loading = false