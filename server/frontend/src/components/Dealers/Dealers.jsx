import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [uniqueStates, setUniqueStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    
    const dealer_url = "/djangoapp/get_dealers";

    const filterDealers = async (state) => {
        const res = await fetch(`/djangoapp/get_dealers/${state}`, { method: "GET" });
        const retobj = await res.json();
        if (retobj.status === 200) {
            setDealersList(Array.from(retobj.dealers));
        }
    };

    const get_dealers = async () => {
        try {
            const res = await fetch(dealer_url, { method: "GET" });
            const retobj = await res.json();
            if (retobj.status === 200) {
                const all_dealers = Array.from(retobj.dealers);
                setUniqueStates([...new Set(all_dealers.map(dealer => dealer.state))]);
                setDealersList(all_dealers);
            }
        } catch (error) {
            console.error("Failed to fetch dealers:", error);
        }
    };

    useEffect(() => {
        get_dealers();
    }, []);

    const isLoggedIn = sessionStorage.getItem("username") != null;

    return (
        <div>
            <Header />
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dealer Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Zip</th>
                        <th>
                            <select
                                name="state"
                                id="state"
                                value={selectedState}
                                onChange={(e) => {
                                    setSelectedState(e.target.value);
                                    filterDealers(e.target.value);
                                }}
                            >
                                <option value="" disabled hidden>State</option>
                                <option value="All">All States</option>
                                {uniqueStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </th>
                        {isLoggedIn && <th>Review Dealer</th>}
                    </tr>
                </thead>
                <tbody>
                    {dealersList.map(dealer => (
                        <tr key={dealer.id}>
                            <td>{dealer.id}</td>
                            <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                            <td>{dealer.city}</td>
                            <td>{dealer.address}</td>
                            <td>{dealer.zip}</td>
                            <td>{dealer.state}</td>
                            {isLoggedIn && (
                                <td>
                                    <a href={`/postreview/${dealer.id}`}>
                                        <img src={review_icon} className="review_icon" alt="Post Review" />
                                    </a>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dealers;
