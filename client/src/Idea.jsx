import React, { useEffect, useState } from 'react'

function Main() {
    const [cookbook, setCookbook] = useState()
    const [vegaCookbook, setVegaCookbook] = useState()
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState('')
    const [history, setHistory]= useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        Cookbook()
    }, [])

    async function Cookbook() {
        try {
            const response = await fetch("http://localhost:3001/", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            const data = await response.json()
            setCookbook(data.message)
            setVegaCookbook(data.vegaMessage)
        } catch (error) {
            console.error('Er is een fout opgetreden:', error)
        }
    }

    async function askQuestion() {
        setLoading(true);
        let finalAnswer = '';
        const newChat = [...chat, { human: input, ai: '' }];
        setChat(newChat);

        try {
            const response = await fetch("http://localhost:3000/", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    human: input,
                    history: history
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const words = chunk.split(/\s+/);

                for (let word of words) {
                    if (word.trim() !== '') {
                        finalAnswer += word + ' ';
                        setChat(prevChat => {
                            const updated = [...prevChat];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                ai: updated[updated.length - 1].ai + word + ' '
                            };
                            return updated;
                        });
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            }

            const updatedHistory = [...history, { human: input, ai: finalAnswer }];
            setHistory(updatedHistory);
            setInput('');
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        askQuestion()
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f4e7cd',
            color: '#fc8f71',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            {/* Header */}
            <header style={{
                padding: '1rem',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #fc8f71'
            }}>
                ChefPrompt
            </header>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '220px',
                    padding: '1rem',
                    borderRight: '1px solid #d6c8aa',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    overflowY: 'auto',
                    alignItems: 'center'
                }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#fc8f71' }}>
                        Today's suggestions<br />
                        <span style={{ fontWeight: 'bold' }}>LET'S COOK MEAT</span>
                    </h3>
                    <img
                        src="/cookbook.png"
                        alt="Cookbook"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <div dangerouslySetInnerHTML={{ __html: cookbook }} />
                </aside>

                {/* Chat area */}
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: '#f4e7cd',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        margin: '0 auto'
                    }}>
                        {chat.map((msg, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

                                <div style={{
                                    alignSelf: 'flex-end',
                                    maxWidth: '80%',
                                    backgroundColor: '#fc8f71',
                                    color: '#f4e7cd',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '16px 16px 0 16px',
                                }}>
                                    <div>{msg.human}</div>
                                </div>

                                <div style={{
                                    alignSelf: 'flex-start',
                                    maxWidth: '90%',
                                    backgroundColor: '#f4e7cd',
                                    color: '#fc8f71',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '16px 16px 16px 0'
                                }}>
                                    <div style={{ fontWeight: 'bold' }}>AI:</div>
                                    <div>{msg.ai}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <aside style={{
                    width: '220px',
                    padding: '1rem',
                    borderLeft: '1px solid #d6c8aa',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    overflowY: 'auto',
                    alignItems: 'center',
                }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#fc8f71' }}>
                    Today's suggestions<br />
                    <span style={{ fontWeight: 'bold' }}>DR. ALLINSON'S COOKERY BOOK</span>
                </h3>
                    <img
                        src="/vegacookbook.png"
                        alt="vega Cookbook"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <div dangerouslySetInnerHTML={{ __html: vegaCookbook }} />
                </aside>
            </div>


            {/* Input area */}
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                borderTop: '1px solid #fc8f71',
                backgroundColor: '#f4e7cd',
                position: 'sticky',
                bottom: 0,
                justifyContent: 'center'
            }}>
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        id="chatfield"
                        placeholder="Ask a cooking question..."
                        onChange={e => setInput(e.target.value)}
                        value={input}
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            border: '1px solid #fc8f71',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            backgroundColor: '#f4e7cd',
                            color: '#fc8f71',
                            outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.25rem',
                            backgroundColor: '#fc8f71',
                            color: '#f4e7cd',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? '...' : 'Ask'}
                    </button>
                </div>
            </form>
        </div>
    );

}

export default Main
