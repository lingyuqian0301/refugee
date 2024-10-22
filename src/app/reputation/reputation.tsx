"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import './reputation.css';
import Image from "next/image";
import profile_pic_1 from '../reputation/profile_pic (1).png'; 
import profile_pic_2 from '../reputation/profile_pic (2).png'; 
 
export default function ReputationPage() {
    const [endorsements, setEndorsements] = useState([
        { id: 1, name: 'Mr. Lim Kai Zhe', position: 'Owner of reataurant',organization: 'Heng Kopitiam', testimonial: 'Khin is a dedicated worker.', image:profile_pic_1 },
        { id: 2, name: 'Mr. Azak Bin Aryan', position: 'Owner of restaurant',organization: 'Restoran Nasi Kandar Rafei Ali', testimonial: 'Highly trustworthy and reliable.', image: profile_pic_2 },
    ]);

    const [disciplineRecords, setDisciplineRecords] = useState([]);

    const requestEndorsement = () => {
        console.log('Requesting new endorsement...');
    };

    return (
        <div className='main-container'>

            <div className="header-section">
                <div>
                    <h2 className='page-title'>Reputation and Trustworthiness</h2>
                    <p>Track your reputation and trust level based on feedback from authorities and community leaders.</p>
                </div>
            </div>

            <div className='content-container'>
                <div className="reputation-container containter-left">
                    <div className="endorsements-section">
                        <h3 className='section-title'>Endorsements</h3>
                        {endorsements.length === 0 ? (
                            <p>No endorsements available.</p>
                        ) : (
                            endorsements.map((endorsement) => (
                                <div key={endorsement.id} className="endorsement-card">
                                    <Image src={endorsement.image} alt={endorsement.name} className="endorser-image" width={50} height={50}/>
                                    <div>
                                        <h4>{endorsement.name}</h4>
                                        <p>{endorsement.organization}</p>
                                        <p>"{endorsement.testimonial}"</p>
                                    </div>
                                    <div className="verified-badge">Verified <FontAwesomeIcon icon={faCircleCheck} style={{ marginLeft: '5px' }} /></div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="endorsements-section">
                        <h3 className='section-title'>Discipline Records</h3>
                        {disciplineRecords.length === 0 ? (
                            <p className='message-p '>No discipline records available.</p>
                        ) : (
                            <ul className="discipline-records">
                            </ul>
                        )}
                    </div>

                    <div className="request-endorsement-section">
                        <h3>Request New Endorsements</h3>
                        <p>Request endorsements from employers, authorities, and verified sources to enhance your reputation score.</p>
                        <button onClick={requestEndorsement}>Request Endorsement</button>
                    </div>
                </div>

                <div className='containter-right'>
                    <div className="score-display">
                        <p className="score-text">Reputation Score</p>
                        <p className="score">85%</p>
                    </div>

                    <div className="score-display">
                        <p className="score-text">Discipline Points</p>
                        <p className="score">100<sub style={{ color: '#c3c3c3',fontSize:'16px' }}>/100</sub></p>
                    </div>

                    <div className="score-display">
                        <p className="score-text">Higher Than</p>
                        <p className="score">98.9%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
