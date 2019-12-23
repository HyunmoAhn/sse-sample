import { Procedure, EVENT } from '../../types';

const eventSourceConfig = {
  withCredentials: true,
}
let source: any

export function init(entry = '/stream') {
  const stocks = new EventSource(entry, eventSourceConfig)

  stocks.onmessage = (res: any) => {
    console.log(res.data)
  };
  stocks.onopen = () => {
    console.log(`Complete to initialize EventSource with : ${entry}`)
    // stocks.addEventListener(EVENT.USER_INFO, ({ data }: any) => console.log((JSON.parse(data))))
  };
  stocks.onerror = (e) => { console.log('occur error: ', e) }
}
