import React, { useEffect, useState } from 'react';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const AutoComplete = () => {
    const [apiData, setApiData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        // Fetch data from your API
        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
        fetch('YOUR_API_ENDPOINT')
            .then((response) => response.json())
            .then((apiData) => {
                setApiData(apiData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            initialValue={selectedItem}
            onSelectItem={(item) => setSelectedItem(item)}
            dataSet={apiData.map((item) => ({
                id: item.id.toString(),
                title: item.title
            }))}
        />
    );
};

export default AutoComplete;
