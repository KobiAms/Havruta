/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Dimensions } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import HTMLRend from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Entypo';

function AboutScreen({ navigation }) {
    const html = `
    <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-b068f75 elementor-hidden-phone elementor-widget elementor-widget-heading" data-id="b068f75" data-element_type="widget" data-widget_type="heading.default">
<div class="elementor-widget-container">
<h2 class="elementor-heading-title elementor-size-default">העמותה</h2>		</div>
</div>
<div class="elementor-element elementor-element-28a4684 elementor-widget elementor-widget-spacer" data-id="28a4684" data-element_type="widget" data-widget_type="spacer.default">
<div class="elementor-widget-container">
<div class="elementor-spacer">
<div class="elementor-spacer-inner"></div>
</div>
</div>
</div>
<section class="elementor-section elementor-inner-section elementor-element elementor-element-5fe2c28 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="5fe2c28" data-element_type="section">
    <div class="elementor-container elementor-column-gap-default">
        <div class="elementor-row">
<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-8593b05" data-id="8593b05" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-bccfad4 elementor-widget elementor-widget-text-editor" data-id="bccfad4" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<p>"חברותא – הומואים דתיים" הינה עמותה רשומה (ע"ר 580533305) המייצגת גוף קהילתי בעל ועד נבחר. הגוף מתנהל בצורה שקופה ובהתאם לתקנון שאושר על ידי רשם העמותות הממשלתי.&nbsp;</p><p>העמותה הינה מוסד ללא מטרות רווח (מלכ"ר), והינה בעלת אישור "ניהול תקין" מרשם העמותות. כמו כן, תרומות לעמותה מוכרות לעניין החזרי מס (סעיף 46א) מטעם מס הכנסה.</p><h3>תקנון העמותה</h3><p>התקנון מובא לעיונכם <a href="http://havruta.org.il/%d7%aa%d7%a7%d7%a0%d7%95%d7%9f-%d7%94%d7%a2%d7%9e%d7%95%d7%aa%d7%94/">כאן</a>.</p><h3>חברי ועד מנהל</h3>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-18157d1" data-id="18157d1" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-77589fe elementor-widget elementor-widget-image" data-id="77589fe" data-element_type="widget" data-widget_type="image.default">
<div class="elementor-widget-container">
            <div class="elementor-image">
                            <img width="800" height="227" src="https://havruta.org.il/wp-content/uploads/2018/06/Havruta_org_il_logo-1024x291.gif" class="attachment-large size-large" alt="" loading="lazy" srcset="https://havruta.org.il/wp-content/uploads/2018/06/Havruta_org_il_logo-1024x291.gif 1024w, https://havruta.org.il/wp-content/uploads/2018/06/Havruta_org_il_logo-300x85.gif 300w, https://havruta.org.il/wp-content/uploads/2018/06/Havruta_org_il_logo-768x219.gif 768w" sizes="(max-width: 800px) 100vw, 800px">														</div>
    </div>
</div>
    </div>
</div>
</div>
            </div>
</div>
</section>
<section class="elementor-section elementor-inner-section elementor-element elementor-element-d52501e elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d52501e" data-element_type="section">
    <div class="elementor-container elementor-column-gap-default">
        <div class="elementor-row">
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-a213601" data-id="a213601" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-7790432 elementor-widget elementor-widget-text-editor" data-id="7790432" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">שי ברמסון</h6>					</div>
    </div>
</div>
<div class="elementor-element elementor-element-0a422f2 elementor-widget elementor-widget-image" data-id="0a422f2" data-element_type="widget" data-widget_type="image.default">
<div class="elementor-widget-container">
            <div class="elementor-image">
                            <img width="150" height="150" src="https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962-150x150.jpg" class="attachment-thumbnail size-thumbnail" alt="שי ברמסון" loading="lazy" srcset="https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962-150x150.jpg 150w, https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962-300x300.jpg 300w, https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962-768x768.jpg 768w, https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962-1024x1024.jpg 1024w, https://havruta.org.il/wp-content/uploads/2019/06/Screenshot_20190625-102215_Facebook-e1579510980962.jpg 1038w" sizes="(max-width: 150px) 100vw, 150px">														</div>
    </div>
</div>
<div class="elementor-element elementor-element-6696a9b elementor-widget elementor-widget-text-editor" data-id="6696a9b" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<p>יושב ראש העמותה</p><p>32, קדימה</p>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-3180381" data-id="3180381" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-2eb7cea elementor-widget elementor-widget-text-editor" data-id="2eb7cea" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">אביחי אברבנאל</h6>					</div>
    </div>
</div>
<div class="elementor-element elementor-element-c89306a elementor-widget elementor-widget-image" data-id="c89306a" data-element_type="widget" data-widget_type="image.default">
<div class="elementor-widget-container">
            <div class="elementor-image">
                            <img width="150" height="150" src="https://havruta.org.il/wp-content/uploads/2019/06/avichai-e1579511023866-150x150.jpg" class="attachment-thumbnail size-thumbnail" alt="אביחי אברבנאל" loading="lazy" srcset="https://havruta.org.il/wp-content/uploads/2019/06/avichai-e1579511023866-150x150.jpg 150w, https://havruta.org.il/wp-content/uploads/2019/06/avichai-e1579511023866-300x300.jpg 300w, https://havruta.org.il/wp-content/uploads/2019/06/avichai-e1579511023866-768x768.jpg 768w, https://havruta.org.il/wp-content/uploads/2019/06/avichai-e1579511023866.jpg 871w" sizes="(max-width: 150px) 100vw, 150px">														</div>
    </div>
</div>
<div class="elementor-element elementor-element-dc4cc27 elementor-widget elementor-widget-text-editor" data-id="dc4cc27" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<p style="text-align: center;">סגן יושב ראש העמותה</p><p style="text-align: center;">28, קריית אונו</p>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-2d8af2e" data-id="2d8af2e" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-8cc6b58 elementor-widget elementor-widget-text-editor" data-id="8cc6b58" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">יהונתן רוסן ממן​</h6>					</div>
    </div>
</div>
<div class="elementor-element elementor-element-5c1e1bb elementor-widget elementor-widget-image" data-id="5c1e1bb" data-element_type="widget" data-widget_type="image.default">
<div class="elementor-widget-container">
            <div class="elementor-image">
                            <img width="150" height="150" src="https://havruta.org.il/wp-content/uploads/2019/06/jonathan-150x150.jpg" class="attachment-thumbnail size-thumbnail" alt="יהונתן רוסן ממן​" loading="lazy" srcset="https://havruta.org.il/wp-content/uploads/2019/06/jonathan-150x150.jpg 150w, https://havruta.org.il/wp-content/uploads/2019/06/jonathan-300x300.jpg 300w, https://havruta.org.il/wp-content/uploads/2019/06/jonathan-768x768.jpg 768w, https://havruta.org.il/wp-content/uploads/2019/06/jonathan-100x100.jpg 100w, https://havruta.org.il/wp-content/uploads/2019/06/jonathan.jpg 864w" sizes="(max-width: 150px) 100vw, 150px">														</div>
    </div>
</div>
<div class="elementor-element elementor-element-59ec983 elementor-widget elementor-widget-text-editor" data-id="59ec983" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<p>גזבר העמותה ומזכיר הועד</p><p>29, אלון שבות</p>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-0af6c34" data-id="0af6c34" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-6e230e2 elementor-widget elementor-widget-text-editor" data-id="6e230e2" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">אייל ליברמן</h6>					</div>
    </div>
</div>
<div class="elementor-element elementor-element-2382446 elementor-widget elementor-widget-image" data-id="2382446" data-element_type="widget" data-widget_type="image.default">
<div class="elementor-widget-container">
            <div class="elementor-image">
                            <img width="150" height="150" src="https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman-150x150.jpg" class="attachment-thumbnail size-thumbnail" alt="אייל ליברמן" loading="lazy" srcset="https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman-150x150.jpg 150w, https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman-300x300.jpg 300w, https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman-1024x1024.jpg 1024w, https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman-768x768.jpg 768w, https://havruta.org.il/wp-content/uploads/2020/01/eyal_liberman.jpg 1442w" sizes="(max-width: 150px) 100vw, 150px">														</div>
    </div>
</div>
<div class="elementor-element elementor-element-193163c elementor-widget elementor-widget-text-editor" data-id="193163c" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<p>חבר ועד</p><p>45, ברלין</p>					</div>
    </div>
</div>
    </div>
</div>
</div>
            </div>
</div>
</section>
<div class="elementor-element elementor-element-a590db2 elementor-widget elementor-widget-text-editor" data-id="a590db2" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h3>חברי ועדת ביקורת</h3>					</div>
    </div>
</div>
<section class="elementor-section elementor-inner-section elementor-element elementor-element-06aeec0 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="06aeec0" data-element_type="section">
    <div class="elementor-container elementor-column-gap-default">
        <div class="elementor-row">
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-37e1744" data-id="37e1744" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-cb31405 elementor-widget elementor-widget-text-editor" data-id="cb31405" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">יעקב הנדלסמן​</h6>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-91b6310" data-id="91b6310" data-element_type="column">
<div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
    <div class="elementor-element elementor-element-5dafa82 elementor-widget elementor-widget-text-editor" data-id="5dafa82" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
            <div class="elementor-text-editor elementor-clearfix">
<h6 style="text-align: center;">נתנאל אייסדורפר</h6>					</div>
    </div>
</div>
    </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-04d31e4" data-id="04d31e4" data-element_type="column">
<div class="elementor-column-wrap">
        <div class="elementor-widget-wrap">
            </div>
</div>
</div>
<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-a2ce14c" data-id="a2ce14c" data-element_type="column">
<div class="elementor-column-wrap">
        <div class="elementor-widget-wrap">
            </div>
</div>
</div>
            </div>
</div>
</section>
<div class="elementor-element elementor-element-d2c1939 elementor-widget elementor-widget-spacer" data-id="d2c1939" data-element_type="widget" data-widget_type="spacer.default">
<div class="elementor-widget-container">
<div class="elementor-spacer">
<div class="elementor-spacer-inner"></div>
</div>
</div>
</div>
<div class="elementor-element elementor-element-3010c53 elementor-widget elementor-widget-spacer" data-id="3010c53" data-element_type="widget" data-widget_type="spacer.default">
<div class="elementor-widget-container">
<div class="elementor-spacer">
<div class="elementor-spacer-inner"></div>
</div>
</div>
</div>
    </div>  
    
    `


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'על העמותה',
        });
    }, [navigation]);

    return (
        <ScrollView style={{ flex: 1, padding: 10 }}>
            <HTMLRend
                source={{ html: html }}
                baseFontStyle={{
                    textAlign: 'right',
                }}
                contentWidth={Dimensions.get('screen').width * (97 / 100)}
            >
            </HTMLRend>
            {/* <WebView source={{ uri: 'https://havruta.org.il/non-profit-organization/' }} /> */}

            <View style={{ height: 40 }}></View>
        </ScrollView>
    );
}
export default AboutScreen;