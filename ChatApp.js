import {
    html,
    render,
    useEffect,
    useState,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

let ws;

function Chat() {
    // Messages
    const [messages, setMessages] = useState([]);
    const onReceiveMessage = ({data}) => setMessages((m) => [...m, data])
    const onSendMessage = (e) => {
        const msg = e.target[0].value;

        e.preventDefault();
        ws.send(msg);
        e.target[0].value = ''
    };

    // Websocket connection + events
    useEffect(() => {
        if (ws) ws.close();
        ws = new WebSocket(`ws://127.0.0.1:3000/ws`);
        ws.addEventListener('message', onReceiveMessage);

        return () => {
            ws.removeEventListener('message', onReceiveMessage)
        }
    }, []);

    return html`
          ${messages.map((message) => html` <div>${message}</div> `)}

          <form onSubmit=${onSendMessage}>
            <input type="text" />
            <button>Send</button>
          </form>
        `
}
render(html`<${Chat} />`, document.getElementById('app'))