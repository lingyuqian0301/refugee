"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../health.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser, faHospital } from '@fortawesome/free-solid-svg-icons';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    hospitalInfo?: HospitalInfo;
    actions?: {
        type: 'appointment';
        hospital: string;
        link: string;
    }[];
    appointmentButton?: {
        text: string;
        link: string;
    };
}

interface HospitalInfo {
    name: string;
    address: string;
    phone: string;
    distance: string;
    appointmentLink?: string;
}

const AIChatbotPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: 'Hi there, how are you feeling today?' }
    ]);

    const [inputMessage, setInputMessage] = useState<string>('');
    const [threadId, setThreadId] = useState<string | null>(null);

    useEffect(() => {
        const initializeThread = async () => {
            try {
                const res = await fetch('/api/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inputMessage: 'Initialize thread', threadId: null }),
                });

                const data = await res.json();
                if (res.ok) {
                    setThreadId(data.threadId);
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error("Error initializing thread:", error);
            }
        };

        initializeThread();
    }, []);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const userMessage: Message = { id: messages.length + 1, sender: 'user', text: inputMessage };
        setMessages([...messages, userMessage]);
        setInputMessage('');

        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputMessage, threadId }),
            });

            const data = await res.json();

            if (res.ok) {
                const linkRegex = /<a href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/;
                const match = data.text.match(linkRegex);
                const textContent = data.text.replace(linkRegex, '').trim();

                const botMessage: Message = {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: textContent,
                    appointmentButton: match
                        ? {
                              text: match[2].trim(),
                              link: match[1],
                          }
                        : undefined,
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error fetching response from OpenAI:", error);
            const errorMessage: Message = {
                id: messages.length + 2,
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again later.'
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    const handleAppointment = async (hospitalName: string) => {
        try {
            const appointment = {
                hospital: hospitalName,
                date: new Date().toISOString().split('T')[0],
                status: 'pending'
            };

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment),
            });

            if (response.ok) {
                const confirmMessage: Message = {
                    id: messages.length + 1,
                    sender: 'bot',
                    text: `I've helped you schedule an appointment at ${hospitalName}. You can view and manage your appointment in the Health Records section.`
                };
                setMessages(prev => [...prev, confirmMessage]);
                window.open('/health/view', '_blank');
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        }
    };

    const parseMessageText = (text: string) => {
        return <ReactMarkdown>{text}</ReactMarkdown>;
    };

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px 0', backgroundColor: '#F4F7FE' }}>
            <h1 style={{ textAlign: 'center' }} className="page-title">Emotional and Mental Health Support</h1>
            <p className="chat-description">Our AI chatbot is here to provide emotional support and coping strategies. Feel free to talk, and it will guide you based on mental health best practices.</p>

            <div className="chat-container">
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <React.Fragment key={message.id}>
                                <div className={`chat-message ${message.sender}`}>
                                    {message.sender === 'bot' ? <FontAwesomeIcon icon={faRobot} className="chat-icon" /> : <FontAwesomeIcon icon={faUser} className="chat-icon user-icon" />}
                                    <div className="message-content">
                                        <div className="message-text">
                                            {parseMessageText(message.text)}
                                        </div>
                                        {message.appointmentButton && (
                                            <button
                                                className="action-button hover:opacity-80"
                                                onClick={() => window.open(message.appointmentButton!.link, '_blank')}
                                                style={{ textDecoration: 'underline' }}
                                            >
                                                {message.appointmentButton.text}
                                            </button>
                                        )}
                                        {message.actions && (
                                            <div className="message-actions">
                                                {message.actions.map((action, index) => (
                                                    <button
                                                        key={index}
                                                        className="action-button"
                                                        onClick={() => handleAppointment(action.hospital)}
                                                    >
                                                        Make Appointment at {action.hospital}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {message.hospitalInfo && (
                                    <div className="hospital-card">
                                        <div className="hospital-header">
                                            <FontAwesomeIcon icon={faHospital} className="hospital-icon" />
                                            <h3>{message.hospitalInfo.name}</h3>
                                        </div>
                                        <p>{message.hospitalInfo.address}</p>
                                        <p>Phone: {message.hospitalInfo.phone}</p>
                                        <p>Distance: {message.hospitalInfo.distance}</p>
                                        {message.hospitalInfo.appointmentLink && (
                                            <button 
                                                className="hospital-appointment-btn"
                                                onClick={() => handleAppointment(message.hospitalInfo!.name)}
                                            >
                                                Schedule Appointment
                                            </button>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="chat-input-section">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <button onClick={sendMessage} className="chat-send-button">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatbotPage;
