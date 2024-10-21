"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import '../health.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

// Dummy dialog 1 (Stress)
const dummyChat1 = [
    { id: 1, sender: 'bot', text: 'Hello! I\'m here to help you with emotional and mental health support. How can I assist you today?' },
    { id: 2, sender: 'user', text: 'Lately, I\'ve been feeling really stressed. I have so much to do, and it feels like everything is piling up. I don\'t know where to start or how to deal with it. Can you help me figure out what to do?' },
    { id: 3, sender: 'bot', text: 'I\'m really sorry to hear you\'re feeling this way. Stress can definitely be overwhelming, especially when it feels like everything is happening at once. You\'re not alone in this, and I\'d be happy to help guide you through some strategies to cope. Can you tell me a bit more about what\'s been causing the stress? Is it work, school, personal life, or a combination of things?' },
    { id: 4, sender: 'user', text: 'It\'s mostly work-related. I\'ve got tight deadlines, and I feel like I\'m always behind. On top of that, there\'s personal stuff going on too, and I just can\'t seem to relax.' },
    { id: 5, sender: 'bot', text: 'That\'s a lot to handle. It\'s important to take care of your mental and emotional well-being during stressful times. One thing that might help immediately is taking a short break. Sometimes when we\'re constantly in "go mode," we forget to pause and breathe. Would you like me to guide you through a short breathing exercise to help you relax in this moment?' },
    { id: 6, sender: 'user', text: 'Yeah, I think I need that right now.' },
    { id: 7, sender: 'bot', text: 'Okay, let\'s start by sitting in a comfortable position. Close your eyes if you feel comfortable doing so, and take a deep breath in through your nose for 4 counts... Hold for 4... Now, slowly exhale through your mouth for 6 counts. Let\'s repeat this a few times.\n(After a few moments of guided breathing)\nHow are you feeling now? A bit more relaxed?' },
    { id: 8, sender: 'user', text: 'Yeah, that helped a little. I feel a bit calmer, but I\'m still unsure how to manage everything.' },
    { id: 9, sender: 'bot', text: 'That\'s a good start, and it\'s great that you\'re open to trying things to feel better. Now, let\'s think about managing your stress in the longer term. Would it help to break down your tasks into smaller, more manageable steps? Sometimes just creating a list of priorities can make things feel less overwhelming.' },
    { id: 10, sender: 'user', text: 'That could work. I think I\'ve been trying to tackle too much at once.' },
    { id: 11, sender: 'bot', text: 'Exactly! Start with what\'s most urgent or important. You don\'t need to do everything all at once. Also, making time for self-care is key, even if it\'s just 10-15 minutes of downtime each day. Whether it\'s taking a walk, reading, or just listening to music, it can help recharge you. How does that sound for a plan?' },
    { id: 12, sender: 'user', text: 'I\'ll give that a try. It sounds like it could help me stay more organized and less overwhelmed.' },
    { id: 13, sender: 'bot', text: 'That\'s a great mindset! And remember, it\'s okay to ask for help when you need it—whether that\'s from colleagues, friends, or even just talking things through. I\'m here anytime you want to chat, or if you need more techniques to manage stress. You\'ve got this!' }
];

// Dummy dialog 2 (Learning a hard skill)
const dummyChat2 = [
    { id: 1, sender: 'bot', text: 'Hello! I\'m here to help you with emotional and mental health support. How can I assist you today?' },
    { id: 2, sender: 'user', text: 'I\'m really interested in learning how to repair cars. Do you know of any workshops or resources that could help me get started?' },
    { id: 3, sender: 'bot', text: 'That\'s a fantastic choice! Car repairing is a valuable skill that can save you money and help you understand your vehicle better. There are workshops specifically designed for beginners. Are you looking for hands-on experience or an online course that you can follow at your own pace?' },
    { id: 4, sender: 'user', text: 'I think hands-on experience would be more beneficial for me. I want to get my hands dirty and really learn how to fix things.' },
    { id: 5, sender: 'bot', text: 'Absolutely! There\'s a “Basic Car Repair Skills” workshop happening next month at a local community center. It\'s a two-day workshop where you\'ll learn about essential tools, basic maintenance, and troubleshooting common car problems. Would you like more details on that?' },
    { id: 6, sender: 'user', text: 'Yes, that sounds perfect! What will we be learning exactly?' },
    { id: 7, sender: 'bot', text: 'Great! In this workshop, you\'ll cover a variety of topics, including:\nUnderstanding Engine Basics: Learn how the engine works and common issues that can arise.\nBasic Maintenance: Oil changes, tire rotations, and brake checks.\nTroubleshooting: Identifying problems using diagnostic tools.\nHands-On Practice: You\'ll work on actual vehicles, guided by experienced instructors.\nThe workshop also includes safety practices while working with car parts. How does that sound to you?' },
    { id: 8, sender: 'user', text: 'That sounds amazing! How long is each session, and when does it take place?' }, 
    { id: 9, sender: 'bot', text: 'Each session lasts about four hours, and the workshop is scheduled for two consecutive Saturdays, from 9 AM to 1 PM. The first session focuses on maintenance, and the second session will dive into troubleshooting and hands-on repairs. It\'s a great way to learn in a supportive environment!' },
    { id: 10, sender: 'user', text: 'That sounds doable! How do I register for the workshop?' },
    { id: 11, sender: 'bot', text: 'You can register online through the community center\'s website. I can share the link with you. They also provide all the materials you\'ll need, so you don\'t have to worry about bringing anything special. Would you like me to find some beginner resources or tutorials to watch before the workshop?' },
    { id: 12, sender: 'user', text: 'Yes, that would be really helpful! I\'d love to have some background knowledge before I get there.' }, 
    { id: 13, sender: 'bot', text: 'Perfect! I\'ll send you a couple of free online resources. There are videos that cover the basics of car repair, including tutorials on oil changes and tire maintenance. There\'s also a forum where you can ask questions and connect with other learners. Let me grab those links for you.' },
    { id: 14, sender: 'user', text: 'Thank you so much! I\'m excited to start learning.' },
    { id: 15, sender: 'bot', text: 'You\'re welcome! It\'s fantastic that you\'re taking this step. Learning car repair can be incredibly rewarding. Remember, practice makes perfect, so don\'t hesitate to ask questions during the workshop. If you ever need more information or tips, feel free to reach out. Happy learning!' }
];

export default function AIChatbotPage() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I\'m here to help you with emotional and mental health support. How can I assist you today?' }
    ]);

    const [inputMessage, setInputMessage] = useState('');

    const [dummyChat, setDummyChat] = useState(1);

    useEffect(() => {
        if (dummyChat === 1) {
            setMessages([...dummyChat1]);
        } else if (dummyChat === 2) {
            setMessages([...dummyChat2]);
        } else {
            setMessages([
                { id: 1, sender: 'bot', text: 'Hello! I\'m here to help you with emotional and mental health support. How can I assist you today?' }
            ]);
        }
    }, [dummyChat]);

    const sendMessage = () => {
        if (inputMessage.trim() === '') return;

        // Add the user message to the chat
        setMessages([...messages, { id: messages.length + 1, sender: 'user', text: inputMessage }]);

        // Clear input field
        setInputMessage('');

        // Add a dummy response from the bot
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: prevMessages.length + 1, sender: 'bot', text: 'Thank you for sharing. I\'m here to support you. Can you tell me more?' }
            ]);
        }, 1000); // Simulate bot response delay
    };

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px 0', backgroundColor: '#F4F7FE' }}>
            <h1 style={{ textAlign: 'center' }} className="page-title">Emotional and Mental Health Support</h1>
            <p className="chat-description">Our AI chatbot is here to provide emotional support and coping strategies. Feel free to talk, and it will guide you based on mental health best practices.</p>

            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }} className="chat-container">
                
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div key={message.id} className={`chat-message ${message.sender}`}>
                                {message.sender === 'bot' ? <FontAwesomeIcon icon={faRobot} className="chat-icon" /> : <FontAwesomeIcon icon={faUser} className="chat-icon user-icon" />}
                                <p className="message-text">{message.text}</p>
                            </div>
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
}
