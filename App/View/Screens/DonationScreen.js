/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Dimensions } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import HTMLRend from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Entypo';

function DonationScreen({ navigation }) {
    const html = `
        <div>
            <h3>עמותת חברותא</h3><p>"חברותא – הומואים דתיים" היא <a href="http://havruta.org.il/non-profit-organization/">עמותה רשומה ללא מטרות רווח</a>. העשייה שלנו כוללת הן פעילות פנימה לרווחת חברי הקהילה (קבוצות, פעילות קהילתית וכו') והן פעילות החוצה (הרצאות, מיסוד פורומים לדיון, קמפיינים, פרסום יצירות ותוכן להט"בי דתי) לשינוי, הרחבת והעמקת השיח הדתי בקהילת הלהט"ב והשיח הלהט"בי במגזר הדתי.</p><h3>התרומות מושקעות במטרותנו</h3><p>חברותא מקפידה לחסוך בהוצאות על תשתית ארגונית ולהשקיע את כספי התרומות בעשייה עצמה. לכן, חברותא מבוססת על מתנדבים אשר תורמים מזמנם ומכשרונם בהתאם ליכולתם – החל מפרוייקטים במחשב בבית לעיתים רחוקות, וכלה בחברי הוועד אשר עושים לילות כימים בפעילות.</p><p>אנו מקפידים שהעשייה הזו תגיע לקהל ללא עלות או במחירים שווים לכל נפש (פעמים רבות נמוכים בהרבה מעלות המוצר או הפעילות). חברי קהילת חברותא ערבים זה לזה – ואנו מסבסדים את הפעילות לחברי קהילה אשר ידם אינה משגת!&nbsp;</p><h3>החזר כספי</h3><p>העמותה שלנו מקפידה על מנהל תקין ופועלת למען מטרות ציבוריות מוכרות. לכן, תרומות עשויות לזכות את התורם בהחזר כספי ממס הכנסה על כ-35% מגובה התרומה. נשמח להסביר עוד – <a href="http://havruta.org.il/%d7%a6%d7%95%d7%a8-%d7%a7%d7%a9%d7%a8/">צרו קשר</a>.</p>					</div>
            <donate>
                <h3 style="text-align: center;">אפשרויות לתרומה</h3>
                <ul>
                    <li>העברה בנקאית – <a href="http://havruta.org.il/%d7%a6%d7%95%d7%a8-%d7%a7%d7%a9%d7%a8/" style="color:#0D5794">צרו קשר בטלפון/מייל</a>.</li>
                    <li>באמצעות צ'ק/מזומן – כנ"ל.</li>
                    <li>תשלום מאובטח ב Paypal – ניתן לתרום באופן חד פעמי או קבוע, לחצו על הכפתור הכתום:</li>

			    	<div><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=L8R6EQHJ8YW8Q&amp;source=url" target="_blank" class="elementor-button-link elementor-button elementor-size-md elementor-animation-grow" role="button">
    			    	<i aria-hidden="true" class="fab fa-paypal"></i>		
			    		<span class="elementor-button-text">לתמיכה</span>	
			    	</a></div>
			    </ul>
            <donate>
        </div>`
    const donate = `https://havruta.org.il/donate/`

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'תרמו לנו',
        });
    }, [navigation])
    return (
        <ScrollView style={{ flex: 1, padding: 10 }}>
            <HTMLRend
                source={{ html: html }}
                baseFontStyle={{
                    textAlign: 'right',
                }}
            >
            </HTMLRend>
            {/* <WebView source={{ uri: 'https://havruta.org.il/donate/' }} /> */}

            <View style={{ height: 40 }}></View>
        </ScrollView>
    );
}
export default DonationScreen;