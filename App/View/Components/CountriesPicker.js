import React, { useState } from 'react';
import { Text, FlatList, TextInput, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function CountriesPicker({ onCountrySelected }) {
    if (!onCountrySelected)
        throw new Error('onCountrySelected is undefined')

    const [selectedCountry, setSelectedContry] = useState({ emoji: "🇺🇳", name: "Select Country" },);
    const [filter, setFilter] = useState()
    const [list_to_show, setShow] = useState(countries);
    const [close, setClose] = useState(true)

    pick_country = item => {
        setFilter()
        onCountrySelected(item)
        setClose(true)
        setSelectedContry(item)
        setShow(countries)
    }

    const renderItem = ({ item }) => <Item item={item} onPress={() => pick_country(item)} />

    const Item = ({ item, onPress }) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Text style={styles.title}>{item.emoji}  -  {item.name}</Text>
        </TouchableOpacity>
    );
    const Selected = ({ item, onPress }) => (
        <TouchableOpacity item={selectedCountry} style={styles.selected} onPress={() => setClose(false)}>
            <Text style={styles.title}>{item.emoji}  -  {item.name}</Text>
        </TouchableOpacity>
    );

    return (
        close ?
            <Selected item={selectedCountry} onPress={() => setClose(false)} />
            :
            <View style={styles.container_open}>
                <View style={styles.container}>
                    <TextInput
                        placeholder="Search Country"
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 10,
                            borderColor: 'gray',
                            borderWidth: 1,
                            marginVertical: 4,
                            marginHorizontal: 10,

                        }}
                        onChangeText={(text) => {
                            setShow(countries.filter(item => item.name.toLowerCase().includes(text.toLowerCase())))
                            setFilter(text)
                        }}
                        value={filter}
                    />
                    <FlatList
                        data={list_to_show}
                        renderItem={renderItem}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    container_open: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    container: {
        height: '100%',
        width: '95%',
        paddingBottom: 5
    },
    item: {
        backgroundColor: 'white',
        width: '95%',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(123, 123, 123, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected: {
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 10,
        borderRadius: 15,
        backgroundColor: 'rgba(123, 123, 123, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
    },
});

let countries = [
    { emoji: "🇦🇨", name: "Ascension Island" },
    { emoji: "🇦🇩", name: "Andorra" },
    { emoji: "🇦🇪", name: "United Arab Emirates" },
    { emoji: "🇦🇫", name: "Afghanistan" },
    { emoji: "🇦🇬", name: "Antigua & Barbuda" },
    { emoji: "🇦🇮", name: "Anguilla" },
    { emoji: "🇦🇱", name: "Albania" },
    { emoji: "🇦🇲", name: "Armenia" },
    { emoji: "🇦🇴", name: "Angola" },
    { emoji: "🇦🇶", name: "Antarctica" },
    { emoji: "🇦🇷", name: "Argentina" },
    { emoji: "🇦🇸", name: "American Samoa" },
    { emoji: "🇦🇹", name: "Austria" },
    { emoji: "🇦🇺", name: "Australia" },
    { emoji: "🇦🇼", name: "Aruba" },
    { emoji: "🇦🇽", name: "Åland Islands" },
    { emoji: "🇦🇿", name: "Azerbaijan" },
    { emoji: "🇧🇦", name: "Bosnia & Herzegovina" },
    { emoji: "🇧🇧", name: "Barbados" },
    { emoji: "🇧🇩", name: "Bangladesh" },
    { emoji: "🇧🇪", name: "Belgium" },
    { emoji: "🇧🇫", name: "Burkina Faso" },
    { emoji: "🇧🇬", name: "Bulgaria" },
    { emoji: "🇧🇭", name: "Bahrain" },
    { emoji: "🇧🇮", name: "Burundi" },
    { emoji: "🇧🇯", name: "Benin" },
    { emoji: "🇧🇱", name: "St. Barthélemy" },
    { emoji: "🇧🇲", name: "Bermuda" },
    { emoji: "🇧🇳", name: "Brunei" },
    { emoji: "🇧🇴", name: "Bolivia" },
    { emoji: "🇧🇶", name: "Caribbean Netherlands" },
    { emoji: "🇧🇷", name: "Brazil" },
    { emoji: "🇧🇸", name: "Bahamas" },
    { emoji: "🇧🇹", name: "Bhutan" },
    { emoji: "🇧🇻", name: "Bouvet Island" },
    { emoji: "🇧🇼", name: "Botswana" },
    { emoji: "🇧🇾", name: "Belarus" },
    { emoji: "🇧🇿", name: "Belize" },
    { emoji: "🇨🇦", name: "Canada" },
    { emoji: "🇨🇨", name: "Cocos (Keeling) Islands" },
    { emoji: "🇨🇩", name: "Congo - Kinshasa" },
    { emoji: "🇨🇫", name: "Central African Republic" },
    { emoji: "🇨🇬", name: "Congo - Brazzaville" },
    { emoji: "🇨🇭", name: "Switzerland" },
    { emoji: "🇨🇮", name: "Côte d’Ivoire" },
    { emoji: "🇨🇰", name: "Cook Islands" },
    { emoji: "🇨🇱", name: "Chile" },
    { emoji: "🇨🇲", name: "Cameroon" },
    { emoji: "🇨🇳", name: "China" },
    { emoji: "🇨🇴", name: "Colombia" },
    { emoji: "🇨🇵", name: "Clipperton Island" },
    { emoji: "🇨🇷", name: "Costa Rica" },
    { emoji: "🇨🇺", name: "Cuba" },
    { emoji: "🇨🇻", name: "Cape Verde" },
    { emoji: "🇨🇼", name: "Curaçao" },
    { emoji: "🇨🇽", name: "Christmas Island" },
    { emoji: "🇨🇾", name: "Cyprus" },
    { emoji: "🇨🇿", name: "Czechia" },
    { emoji: "🇩🇪", name: "Germany" },
    { emoji: "🇩🇬", name: "Diego Garcia" },
    { emoji: "🇩🇯", name: "Djibouti" },
    { emoji: "🇩🇰", name: "Denmark" },
    { emoji: "🇩🇲", name: "Dominica" },
    { emoji: "🇩🇴", name: "Dominican Republic" },
    { emoji: "🇩🇿", name: "Algeria" },
    { emoji: "🇪🇦", name: "Ceuta & Melilla" },
    { emoji: "🇪🇨", name: "Ecuador" },
    { emoji: "🇪🇪", name: "Estonia" },
    { emoji: "🇪🇬", name: "Egypt" },
    { emoji: "🇪🇭", name: "Western Sahara" },
    { emoji: "🇪🇷", name: "Eritrea" },
    { emoji: "🇪🇸", name: "Spain" },
    { emoji: "🇪🇹", name: "Ethiopia" },
    { emoji: "🇫🇮", name: "Finland" },
    { emoji: "🇫🇯", name: "Fiji" },
    { emoji: "🇫🇰", name: "Falkland Islands" },
    { emoji: "🇫🇲", name: "Micronesia" },
    { emoji: "🇫🇴", name: "Faroe Islands" },
    { emoji: "🇫🇷", name: "France" },
    { emoji: "🇬🇦", name: "Gabon" },
    { emoji: "🇬🇧", name: "United Kingdom" },
    { emoji: "🇬🇩", name: "Grenada" },
    { emoji: "🇬🇪", name: "Georgia" },
    { emoji: "🇬🇫", name: "French Guiana" },
    { emoji: "🇬🇬", name: "Guernsey" },
    { emoji: "🇬🇭", name: "Ghana" },
    { emoji: "🇬🇮", name: "Gibraltar" },
    { emoji: "🇬🇱", name: "Greenland" },
    { emoji: "🇬🇲", name: "Gambia" },
    { emoji: "🇬🇳", name: "Guinea" },
    { emoji: "🇬🇵", name: "Guadeloupe" },
    { emoji: "🇬🇶", name: "Equatorial Guinea" },
    { emoji: "🇬🇷", name: "Greece" },
    { emoji: "🇬🇸", name: "South Georgia & South Sandwich Islands" },
    { emoji: "🇬🇹", name: "Guatemala" },
    { emoji: "🇬🇺", name: "Guam" },
    { emoji: "🇬🇼", name: "Guinea-Bissau" },
    { emoji: "🇬🇾", name: "Guyana" },
    { emoji: "🇭🇰", name: "Hong Kong SAR China" },
    { emoji: "🇭🇲", name: "Heard & McDonald Islands" },
    { emoji: "🇭🇳", name: "Honduras" },
    { emoji: "🇭🇷", name: "Croatia" },
    { emoji: "🇭🇹", name: "Haiti" },
    { emoji: "🇭🇺", name: "Hungary" },
    { emoji: "🇮🇨", name: "Canary Islands" },
    { emoji: "🇮🇩", name: "Indonesia" },
    { emoji: "🇮🇪", name: "Ireland" },
    { emoji: "🇮🇱", name: "Israel" },
    { emoji: "🇮🇲", name: "Isle of Man" },
    { emoji: "🇮🇳", name: "India" },
    { emoji: "🇮🇴", name: "British Indian Ocean Territory" },
    { emoji: "🇮🇶", name: "Iraq" },
    { emoji: "🇮🇷", name: "Iran" },
    { emoji: "🇮🇸", name: "Iceland" },
    { emoji: "🇮🇹", name: "Italy" },
    { emoji: "🇯🇪", name: "Jersey" },
    { emoji: "🇯🇲", name: "Jamaica" },
    { emoji: "🇯🇴", name: "Jordan" },
    { emoji: "🇯🇵", name: "Japan" },
    { emoji: "🇰🇪", name: "Kenya" },
    { emoji: "🇰🇬", name: "Kyrgyzstan" },
    { emoji: "🇰🇭", name: "Cambodia" },
    { emoji: "🇰🇮", name: "Kiribati" },
    { emoji: "🇰🇲", name: "Comoros" },
    { emoji: "🇰🇳", name: "St. Kitts & Nevis" },
    { emoji: "🇰🇵", name: "North Korea" },
    { emoji: "🇰🇷", name: "South Korea" },
    { emoji: "🇰🇼", name: "Kuwait" },
    { emoji: "🇰🇾", name: "Cayman Islands" },
    { emoji: "🇰🇿", name: "Kazakhstan" },
    { emoji: "🇱🇦", name: "Laos" },
    { emoji: "🇱🇧", name: "Lebanon" },
    { emoji: "🇱🇨", name: "St. Lucia" },
    { emoji: "🇱🇮", name: "Liechtenstein" },
    { emoji: "🇱🇰", name: "Sri Lanka" },
    { emoji: "🇱🇷", name: "Liberia" },
    { emoji: "🇱🇸", name: "Lesotho" },
    { emoji: "🇱🇹", name: "Lithuania" },
    { emoji: "🇱🇺", name: "Luxembourg" },
    { emoji: "🇱🇻", name: "Latvia" },
    { emoji: "🇱🇾", name: "Libya" },
    { emoji: "🇲🇦", name: "Morocco" },
    { emoji: "🇲🇨", name: "Monaco" },
    { emoji: "🇲🇩", name: "Moldova" },
    { emoji: "🇲🇪", name: "Montenegro" },
    { emoji: "🇲🇫", name: "St. Martin" },
    { emoji: "🇲🇬", name: "Madagascar" },
    { emoji: "🇲🇭", name: "Marshall Islands" },
    { emoji: "🇲🇰", name: "North Macedonia" },
    { emoji: "🇲🇱", name: "Mali" },
    { emoji: "🇲🇲", name: "Myanmar (Burma)" },
    { emoji: "🇲🇳", name: "Mongolia" },
    { emoji: "🇲🇴", name: "Macao SAR China" },
    { emoji: "🇲🇵", name: "Northern Mariana Islands" },
    { emoji: "🇲🇶", name: "Martinique" },
    { emoji: "🇲🇷", name: "Mauritania" },
    { emoji: "🇲🇸", name: "Montserrat" },
    { emoji: "🇲🇹", name: "Malta" },
    { emoji: "🇲🇺", name: "Mauritius" },
    { emoji: "🇲🇻", name: "Maldives" },
    { emoji: "🇲🇼", name: "Malawi" },
    { emoji: "🇲🇽", name: "Mexico" },
    { emoji: "🇲🇾", name: "Malaysia" },
    { emoji: "🇲🇿", name: "Mozambique" },
    { emoji: "🇳🇦", name: "Namibia" },
    { emoji: "🇳🇨", name: "New Caledonia" },
    { emoji: "🇳🇪", name: "Niger" },
    { emoji: "🇳🇫", name: "Norfolk Island" },
    { emoji: "🇳🇬", name: "Nigeria" },
    { emoji: "🇳🇮", name: "Nicaragua" },
    { emoji: "🇳🇱", name: "Netherlands" },
    { emoji: "🇳🇴", name: "Norway" },
    { emoji: "🇳🇵", name: "Nepal" },
    { emoji: "🇳🇷", name: "Nauru" },
    { emoji: "🇳🇺", name: "Niue" },
    { emoji: "🇳🇿", name: "New Zealand" },
    { emoji: "🇴🇲", name: "Oman" },
    { emoji: "🇵🇦", name: "Panama" },
    { emoji: "🇵🇪", name: "Peru" },
    { emoji: "🇵🇫", name: "French Polynesia" },
    { emoji: "🇵🇬", name: "Papua New Guinea" },
    { emoji: "🇵🇭", name: "Philippines" },
    { emoji: "🇵🇰", name: "Pakistan" },
    { emoji: "🇵🇱", name: "Poland" },
    { emoji: "🇵🇲", name: "St. Pierre & Miquelon" },
    { emoji: "🇵🇳", name: "Pitcairn Islands" },
    { emoji: "🇵🇷", name: "Puerto Rico" },
    { emoji: "🇵🇸", name: "Palestinian Territories" },
    { emoji: "🇵🇹", name: "Portugal" },
    { emoji: "🇵🇼", name: "Palau" },
    { emoji: "🇵🇾", name: "Paraguay" },
    { emoji: "🇶🇦", name: "Qatar" },
    { emoji: "🇷🇪", name: "Réunion" },
    { emoji: "🇷🇴", name: "Romania" },
    { emoji: "🇷🇸", name: "Serbia" },
    { emoji: "🇷🇺", name: "Russia" },
    { emoji: "🇷🇼", name: "Rwanda" },
    { emoji: "🇸🇦", name: "Saudi Arabia" },
    { emoji: "🇸🇧", name: "Solomon Islands" },
    { emoji: "🇸🇨", name: "Seychelles" },
    { emoji: "🇸🇩", name: "Sudan" },
    { emoji: "🇸🇪", name: "Sweden" },
    { emoji: "🇸🇬", name: "Singapore" },
    { emoji: "🇸🇭", name: "St. Helena" },
    { emoji: "🇸🇮", name: "Slovenia" },
    { emoji: "🇸🇯", name: "Svalbard & Jan Mayen" },
    { emoji: "🇸🇰", name: "Slovakia" },
    { emoji: "🇸🇱", name: "Sierra Leone" },
    { emoji: "🇸🇲", name: "San Marino" },
    { emoji: "🇸🇳", name: "Senegal" },
    { emoji: "🇸🇴", name: "Somalia" },
    { emoji: "🇸🇷", name: "Suriname" },
    { emoji: "🇸🇸", name: "South Sudan" },
    { emoji: "🇸🇹", name: "São Tomé & Príncipe" },
    { emoji: "🇸🇻", name: "El Salvador" },
    { emoji: "🇸🇽", name: "Sint Maarten" },
    { emoji: "🇸🇾", name: "Syria" },
    { emoji: "🇸🇿", name: "Eswatini" },
    { emoji: "🇹🇦", name: "Tristan da Cunha" },
    { emoji: "🇹🇨", name: "Turks & Caicos Islands" },
    { emoji: "🇹🇩", name: "Chad" },
    { emoji: "🇹🇫", name: "French Southern Territories" },
    { emoji: "🇹🇬", name: "Togo" },
    { emoji: "🇹🇭", name: "Thailand" },
    { emoji: "🇹🇯", name: "Tajikistan" },
    { emoji: "🇹🇰", name: "Tokelau" },
    { emoji: "🇹🇱", name: "Timor-Leste" },
    { emoji: "🇹🇲", name: "Turkmenistan" },
    { emoji: "🇹🇳", name: "Tunisia" },
    { emoji: "🇹🇴", name: "Tonga" },
    { emoji: "🇹🇷", name: "Turkey" },
    { emoji: "🇹🇹", name: "Trinidad & Tobago" },
    { emoji: "🇹🇻", name: "Tuvalu" },
    { emoji: "🇹🇼", name: "Taiwan" },
    { emoji: "🇹🇿", name: "Tanzania" },
    { emoji: "🇺🇦", name: "Ukraine" },
    { emoji: "🇺🇬", name: "Uganda" },
    { emoji: "🇺🇲", name: "U.S. Outlying Islands" },
    { emoji: "🇺🇸", name: "United States" },
    { emoji: "🇺🇾", name: "Uruguay" },
    { emoji: "🇺🇿", name: "Uzbekistan" },
    { emoji: "🇻🇦", name: "Vatican City" },
    { emoji: "🇻🇨", name: "St. Vincent & Grenadines" },
    { emoji: "🇻🇪", name: "Venezuela" },
    { emoji: "🇻🇬", name: "British Virgin Islands" },
    { emoji: "🇻🇮", name: "U.S. Virgin Islands" },
    { emoji: "🇻🇳", name: "Vietnam" },
    { emoji: "🇻🇺", name: "Vanuatu" },
    { emoji: "🇼🇫", name: "Wallis & Futuna" },
    { emoji: "🇼🇸", name: "Samoa" },
    { emoji: "🇽🇰", name: "Kosovo" },
    { emoji: "🇾🇪", name: "Yemen" },
    { emoji: "🇾🇹", name: "Mayotte" },
    { emoji: "🇿🇦", name: "South Africa" },
    { emoji: "🇿🇲", name: "Zambia" },
    { emoji: "🇿🇼", name: "Zimbabwe" },
    { emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "England" },
    { emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", name: "Scotland" },
    { emoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", name: "Wales" }
]
