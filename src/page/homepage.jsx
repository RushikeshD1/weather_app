
import { useState } from "react";
import "./index.css";

const HomePage = () => {
    const city = ["London", "New York", "Los Angeles", "Las Vegas"];

    const [highlight, setHighLight] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [search, setSearch] = useState("");
    const [highlightedRows, setHighlightedRows] = useState([]);

    const getHightBtn = async () => {
        try {
            const currIndex = highlight.length;

            if (currIndex < city.length) {
                const cityName = city[currIndex];
                const response = await fetch(`https://python3-dot-parul-arena-2.uc.r.appspot.com/test?cityname=${cityName}`)
                
                const data = await response.json();
                const weatherInfo = {
                    city: cityName,
                    description: data.description || "no description",
                    temperature: data.temp_in_celsius || "N/A",
                    pressure: data.pressure_in_hPa || "N/A",
                    dataAge: data.humidity_in_percent || "N/A"
                };

                setWeatherData((prev) => [...prev, weatherInfo]);
                setHighLight(prev => [...prev, currIndex]);
            }
        } catch (e) {
            console.log("error", e)
        }
    };

    const deleteWeather = (index) => {
        const filterData = weatherData.filter((_, i) => i !== index);
        setWeatherData(filterData);

        const deleteHigh = highlight.filter((_, i) => i !== index);
        setHighLight(deleteHigh);
    };

    const getSearchData = () => {
        const matchedRow = weatherData
            .map((data, index) => (data.city.toLowerCase().includes(search.toLowerCase()) ? index : null))
            .filter(index => index !== null);

        if (matchedRow.length === 0) {
            setHighlightedRows([]);
            setSearch("") 
        } else {
            setHighlightedRows(matchedRow);
        }

        setTimeout(() => {
            setHighlightedRows([])
            setSearch("")
        }, 2000)
    };

    const handleDescriptionChange = (e, index) => {
        const newDescription = e.target.value;
        const updatedWeatherData = weatherData.map((item, i) =>
            i === index ? { ...item, description: newDescription } : item
        );
        setWeatherData(updatedWeatherData);
    };

    return (
        <div className="container">
            <header className="header">Rushikesh Weather App</header>

            <div className="weather_container">
                <div className="weather_left">
                    <div onClick={getHightBtn} className="get_btn">Get Weather</div>
                    <div className="data_list">
                        <div className="high_city">City</div>
                        {city.map((list, index) => (
                            <div className={`list_city ${highlight.includes(index) ? "hilight" : ""}`} key={index}>
                                {list}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="weather_right">
                    <div className="search">
                        <input 
                            type="text" 
                            className="input_search" 
                            placeholder="City Name" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}                             
                        />
                        <div onClick={getSearchData} className="search_btn">Search</div>
                    </div>
                    <div className="table">
                        <table className="table_data">
                            <thead className="thead">
                                <tr className="tr">
                                    <td className="thead_td">City</td>
                                    <td className="thead_td">Description</td>
                                    <td className="thead_td">Temperature</td>
                                    <td className="thead_td">Pressure</td>
                                    <td className="thead_td">Data age (hrs)</td>
                                    <td className="thead_td">Delete</td>
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {weatherData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="no-data">No Data</td>
                                    </tr>
                                ) : weatherData.map((list, index) => (
                                    <tr key={index} className={`tbody_tr ${highlightedRows.includes(index) ? "tbody_high" : ""}`}>
                                        <td className="tbody_td">{list.city}</td>
                                        <td className="tbody_td">
                                            <input 
                                                type="text" 
                                                value={list.description} 
                                                onChange={(e) => handleDescriptionChange(e, index)} 
                                            />
                                        </td>
                                        <td className="tbody_td">{list.temperature}</td>
                                        <td className="tbody_td">{list.pressure}</td>
                                        <td className="tbody_td">{list.dataAge}</td>
                                        <td onClick={() => deleteWeather(index)} className="tbody_delete">Delete</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
