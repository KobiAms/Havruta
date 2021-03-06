import React, { useState } from 'react';
import { Text, FlatList, TextInput, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function CountriesPicker({ onCountrySelected }) {
    if (!onCountrySelected)
        throw new Error('onCountrySelected is undefined')

    const [selectedCountry, setSelectedContry] = useState({ emoji: "πΊπ³", name: "Select Country" },);
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
    { emoji: "π¦π¨", name: "Ascension Island" },
    { emoji: "π¦π©", name: "Andorra" },
    { emoji: "π¦πͺ", name: "United Arab Emirates" },
    { emoji: "π¦π«", name: "Afghanistan" },
    { emoji: "π¦π¬", name: "Antigua & Barbuda" },
    { emoji: "π¦π?", name: "Anguilla" },
    { emoji: "π¦π±", name: "Albania" },
    { emoji: "π¦π²", name: "Armenia" },
    { emoji: "π¦π΄", name: "Angola" },
    { emoji: "π¦πΆ", name: "Antarctica" },
    { emoji: "π¦π·", name: "Argentina" },
    { emoji: "π¦πΈ", name: "American Samoa" },
    { emoji: "π¦πΉ", name: "Austria" },
    { emoji: "π¦πΊ", name: "Australia" },
    { emoji: "π¦πΌ", name: "Aruba" },
    { emoji: "π¦π½", name: "Γland Islands" },
    { emoji: "π¦πΏ", name: "Azerbaijan" },
    { emoji: "π§π¦", name: "Bosnia & Herzegovina" },
    { emoji: "π§π§", name: "Barbados" },
    { emoji: "π§π©", name: "Bangladesh" },
    { emoji: "π§πͺ", name: "Belgium" },
    { emoji: "π§π«", name: "Burkina Faso" },
    { emoji: "π§π¬", name: "Bulgaria" },
    { emoji: "π§π­", name: "Bahrain" },
    { emoji: "π§π?", name: "Burundi" },
    { emoji: "π§π―", name: "Benin" },
    { emoji: "π§π±", name: "St. BarthΓ©lemy" },
    { emoji: "π§π²", name: "Bermuda" },
    { emoji: "π§π³", name: "Brunei" },
    { emoji: "π§π΄", name: "Bolivia" },
    { emoji: "π§πΆ", name: "Caribbean Netherlands" },
    { emoji: "π§π·", name: "Brazil" },
    { emoji: "π§πΈ", name: "Bahamas" },
    { emoji: "π§πΉ", name: "Bhutan" },
    { emoji: "π§π»", name: "Bouvet Island" },
    { emoji: "π§πΌ", name: "Botswana" },
    { emoji: "π§πΎ", name: "Belarus" },
    { emoji: "π§πΏ", name: "Belize" },
    { emoji: "π¨π¦", name: "Canada" },
    { emoji: "π¨π¨", name: "Cocos (Keeling) Islands" },
    { emoji: "π¨π©", name: "Congo - Kinshasa" },
    { emoji: "π¨π«", name: "Central African Republic" },
    { emoji: "π¨π¬", name: "Congo - Brazzaville" },
    { emoji: "π¨π­", name: "Switzerland" },
    { emoji: "π¨π?", name: "CΓ΄te dβIvoire" },
    { emoji: "π¨π°", name: "Cook Islands" },
    { emoji: "π¨π±", name: "Chile" },
    { emoji: "π¨π²", name: "Cameroon" },
    { emoji: "π¨π³", name: "China" },
    { emoji: "π¨π΄", name: "Colombia" },
    { emoji: "π¨π΅", name: "Clipperton Island" },
    { emoji: "π¨π·", name: "Costa Rica" },
    { emoji: "π¨πΊ", name: "Cuba" },
    { emoji: "π¨π»", name: "Cape Verde" },
    { emoji: "π¨πΌ", name: "CuraΓ§ao" },
    { emoji: "π¨π½", name: "Christmas Island" },
    { emoji: "π¨πΎ", name: "Cyprus" },
    { emoji: "π¨πΏ", name: "Czechia" },
    { emoji: "π©πͺ", name: "Germany" },
    { emoji: "π©π¬", name: "Diego Garcia" },
    { emoji: "π©π―", name: "Djibouti" },
    { emoji: "π©π°", name: "Denmark" },
    { emoji: "π©π²", name: "Dominica" },
    { emoji: "π©π΄", name: "Dominican Republic" },
    { emoji: "π©πΏ", name: "Algeria" },
    { emoji: "πͺπ¦", name: "Ceuta & Melilla" },
    { emoji: "πͺπ¨", name: "Ecuador" },
    { emoji: "πͺπͺ", name: "Estonia" },
    { emoji: "πͺπ¬", name: "Egypt" },
    { emoji: "πͺπ­", name: "Western Sahara" },
    { emoji: "πͺπ·", name: "Eritrea" },
    { emoji: "πͺπΈ", name: "Spain" },
    { emoji: "πͺπΉ", name: "Ethiopia" },
    { emoji: "π«π?", name: "Finland" },
    { emoji: "π«π―", name: "Fiji" },
    { emoji: "π«π°", name: "Falkland Islands" },
    { emoji: "π«π²", name: "Micronesia" },
    { emoji: "π«π΄", name: "Faroe Islands" },
    { emoji: "π«π·", name: "France" },
    { emoji: "π¬π¦", name: "Gabon" },
    { emoji: "π¬π§", name: "United Kingdom" },
    { emoji: "π¬π©", name: "Grenada" },
    { emoji: "π¬πͺ", name: "Georgia" },
    { emoji: "π¬π«", name: "French Guiana" },
    { emoji: "π¬π¬", name: "Guernsey" },
    { emoji: "π¬π­", name: "Ghana" },
    { emoji: "π¬π?", name: "Gibraltar" },
    { emoji: "π¬π±", name: "Greenland" },
    { emoji: "π¬π²", name: "Gambia" },
    { emoji: "π¬π³", name: "Guinea" },
    { emoji: "π¬π΅", name: "Guadeloupe" },
    { emoji: "π¬πΆ", name: "Equatorial Guinea" },
    { emoji: "π¬π·", name: "Greece" },
    { emoji: "π¬πΈ", name: "South Georgia & South Sandwich Islands" },
    { emoji: "π¬πΉ", name: "Guatemala" },
    { emoji: "π¬πΊ", name: "Guam" },
    { emoji: "π¬πΌ", name: "Guinea-Bissau" },
    { emoji: "π¬πΎ", name: "Guyana" },
    { emoji: "π­π°", name: "Hong Kong SAR China" },
    { emoji: "π­π²", name: "Heard & McDonald Islands" },
    { emoji: "π­π³", name: "Honduras" },
    { emoji: "π­π·", name: "Croatia" },
    { emoji: "π­πΉ", name: "Haiti" },
    { emoji: "π­πΊ", name: "Hungary" },
    { emoji: "π?π¨", name: "Canary Islands" },
    { emoji: "π?π©", name: "Indonesia" },
    { emoji: "π?πͺ", name: "Ireland" },
    { emoji: "π?π±", name: "Israel" },
    { emoji: "π?π²", name: "Isle of Man" },
    { emoji: "π?π³", name: "India" },
    { emoji: "π?π΄", name: "British Indian Ocean Territory" },
    { emoji: "π?πΆ", name: "Iraq" },
    { emoji: "π?π·", name: "Iran" },
    { emoji: "π?πΈ", name: "Iceland" },
    { emoji: "π?πΉ", name: "Italy" },
    { emoji: "π―πͺ", name: "Jersey" },
    { emoji: "π―π²", name: "Jamaica" },
    { emoji: "π―π΄", name: "Jordan" },
    { emoji: "π―π΅", name: "Japan" },
    { emoji: "π°πͺ", name: "Kenya" },
    { emoji: "π°π¬", name: "Kyrgyzstan" },
    { emoji: "π°π­", name: "Cambodia" },
    { emoji: "π°π?", name: "Kiribati" },
    { emoji: "π°π²", name: "Comoros" },
    { emoji: "π°π³", name: "St. Kitts & Nevis" },
    { emoji: "π°π΅", name: "North Korea" },
    { emoji: "π°π·", name: "South Korea" },
    { emoji: "π°πΌ", name: "Kuwait" },
    { emoji: "π°πΎ", name: "Cayman Islands" },
    { emoji: "π°πΏ", name: "Kazakhstan" },
    { emoji: "π±π¦", name: "Laos" },
    { emoji: "π±π§", name: "Lebanon" },
    { emoji: "π±π¨", name: "St. Lucia" },
    { emoji: "π±π?", name: "Liechtenstein" },
    { emoji: "π±π°", name: "Sri Lanka" },
    { emoji: "π±π·", name: "Liberia" },
    { emoji: "π±πΈ", name: "Lesotho" },
    { emoji: "π±πΉ", name: "Lithuania" },
    { emoji: "π±πΊ", name: "Luxembourg" },
    { emoji: "π±π»", name: "Latvia" },
    { emoji: "π±πΎ", name: "Libya" },
    { emoji: "π²π¦", name: "Morocco" },
    { emoji: "π²π¨", name: "Monaco" },
    { emoji: "π²π©", name: "Moldova" },
    { emoji: "π²πͺ", name: "Montenegro" },
    { emoji: "π²π«", name: "St. Martin" },
    { emoji: "π²π¬", name: "Madagascar" },
    { emoji: "π²π­", name: "Marshall Islands" },
    { emoji: "π²π°", name: "North Macedonia" },
    { emoji: "π²π±", name: "Mali" },
    { emoji: "π²π²", name: "Myanmar (Burma)" },
    { emoji: "π²π³", name: "Mongolia" },
    { emoji: "π²π΄", name: "Macao SAR China" },
    { emoji: "π²π΅", name: "Northern Mariana Islands" },
    { emoji: "π²πΆ", name: "Martinique" },
    { emoji: "π²π·", name: "Mauritania" },
    { emoji: "π²πΈ", name: "Montserrat" },
    { emoji: "π²πΉ", name: "Malta" },
    { emoji: "π²πΊ", name: "Mauritius" },
    { emoji: "π²π»", name: "Maldives" },
    { emoji: "π²πΌ", name: "Malawi" },
    { emoji: "π²π½", name: "Mexico" },
    { emoji: "π²πΎ", name: "Malaysia" },
    { emoji: "π²πΏ", name: "Mozambique" },
    { emoji: "π³π¦", name: "Namibia" },
    { emoji: "π³π¨", name: "New Caledonia" },
    { emoji: "π³πͺ", name: "Niger" },
    { emoji: "π³π«", name: "Norfolk Island" },
    { emoji: "π³π¬", name: "Nigeria" },
    { emoji: "π³π?", name: "Nicaragua" },
    { emoji: "π³π±", name: "Netherlands" },
    { emoji: "π³π΄", name: "Norway" },
    { emoji: "π³π΅", name: "Nepal" },
    { emoji: "π³π·", name: "Nauru" },
    { emoji: "π³πΊ", name: "Niue" },
    { emoji: "π³πΏ", name: "New Zealand" },
    { emoji: "π΄π²", name: "Oman" },
    { emoji: "π΅π¦", name: "Panama" },
    { emoji: "π΅πͺ", name: "Peru" },
    { emoji: "π΅π«", name: "French Polynesia" },
    { emoji: "π΅π¬", name: "Papua New Guinea" },
    { emoji: "π΅π­", name: "Philippines" },
    { emoji: "π΅π°", name: "Pakistan" },
    { emoji: "π΅π±", name: "Poland" },
    { emoji: "π΅π²", name: "St. Pierre & Miquelon" },
    { emoji: "π΅π³", name: "Pitcairn Islands" },
    { emoji: "π΅π·", name: "Puerto Rico" },
    { emoji: "π΅πΈ", name: "Palestinian Territories" },
    { emoji: "π΅πΉ", name: "Portugal" },
    { emoji: "π΅πΌ", name: "Palau" },
    { emoji: "π΅πΎ", name: "Paraguay" },
    { emoji: "πΆπ¦", name: "Qatar" },
    { emoji: "π·πͺ", name: "RΓ©union" },
    { emoji: "π·π΄", name: "Romania" },
    { emoji: "π·πΈ", name: "Serbia" },
    { emoji: "π·πΊ", name: "Russia" },
    { emoji: "π·πΌ", name: "Rwanda" },
    { emoji: "πΈπ¦", name: "Saudi Arabia" },
    { emoji: "πΈπ§", name: "Solomon Islands" },
    { emoji: "πΈπ¨", name: "Seychelles" },
    { emoji: "πΈπ©", name: "Sudan" },
    { emoji: "πΈπͺ", name: "Sweden" },
    { emoji: "πΈπ¬", name: "Singapore" },
    { emoji: "πΈπ­", name: "St. Helena" },
    { emoji: "πΈπ?", name: "Slovenia" },
    { emoji: "πΈπ―", name: "Svalbard & Jan Mayen" },
    { emoji: "πΈπ°", name: "Slovakia" },
    { emoji: "πΈπ±", name: "Sierra Leone" },
    { emoji: "πΈπ²", name: "San Marino" },
    { emoji: "πΈπ³", name: "Senegal" },
    { emoji: "πΈπ΄", name: "Somalia" },
    { emoji: "πΈπ·", name: "Suriname" },
    { emoji: "πΈπΈ", name: "South Sudan" },
    { emoji: "πΈπΉ", name: "SΓ£o TomΓ© & PrΓ­ncipe" },
    { emoji: "πΈπ»", name: "El Salvador" },
    { emoji: "πΈπ½", name: "Sint Maarten" },
    { emoji: "πΈπΎ", name: "Syria" },
    { emoji: "πΈπΏ", name: "Eswatini" },
    { emoji: "πΉπ¦", name: "Tristan da Cunha" },
    { emoji: "πΉπ¨", name: "Turks & Caicos Islands" },
    { emoji: "πΉπ©", name: "Chad" },
    { emoji: "πΉπ«", name: "French Southern Territories" },
    { emoji: "πΉπ¬", name: "Togo" },
    { emoji: "πΉπ­", name: "Thailand" },
    { emoji: "πΉπ―", name: "Tajikistan" },
    { emoji: "πΉπ°", name: "Tokelau" },
    { emoji: "πΉπ±", name: "Timor-Leste" },
    { emoji: "πΉπ²", name: "Turkmenistan" },
    { emoji: "πΉπ³", name: "Tunisia" },
    { emoji: "πΉπ΄", name: "Tonga" },
    { emoji: "πΉπ·", name: "Turkey" },
    { emoji: "πΉπΉ", name: "Trinidad & Tobago" },
    { emoji: "πΉπ»", name: "Tuvalu" },
    { emoji: "πΉπΌ", name: "Taiwan" },
    { emoji: "πΉπΏ", name: "Tanzania" },
    { emoji: "πΊπ¦", name: "Ukraine" },
    { emoji: "πΊπ¬", name: "Uganda" },
    { emoji: "πΊπ²", name: "U.S. Outlying Islands" },
    { emoji: "πΊπΈ", name: "United States" },
    { emoji: "πΊπΎ", name: "Uruguay" },
    { emoji: "πΊπΏ", name: "Uzbekistan" },
    { emoji: "π»π¦", name: "Vatican City" },
    { emoji: "π»π¨", name: "St. Vincent & Grenadines" },
    { emoji: "π»πͺ", name: "Venezuela" },
    { emoji: "π»π¬", name: "British Virgin Islands" },
    { emoji: "π»π?", name: "U.S. Virgin Islands" },
    { emoji: "π»π³", name: "Vietnam" },
    { emoji: "π»πΊ", name: "Vanuatu" },
    { emoji: "πΌπ«", name: "Wallis & Futuna" },
    { emoji: "πΌπΈ", name: "Samoa" },
    { emoji: "π½π°", name: "Kosovo" },
    { emoji: "πΎπͺ", name: "Yemen" },
    { emoji: "πΎπΉ", name: "Mayotte" },
    { emoji: "πΏπ¦", name: "South Africa" },
    { emoji: "πΏπ²", name: "Zambia" },
    { emoji: "πΏπΌ", name: "Zimbabwe" },
    { emoji: "π΄σ §σ ’σ ₯σ ?σ §σ Ώ", name: "England" },
    { emoji: "π΄σ §σ ’σ ³σ £σ ΄σ Ώ", name: "Scotland" },
    { emoji: "π΄σ §σ ’σ ·σ ¬σ ³σ Ώ", name: "Wales" }
]
