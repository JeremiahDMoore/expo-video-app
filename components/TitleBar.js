import { StyleSheet, View, Text } from "react-native";

const TitleBar = ({ title }) => (
    <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    titleBar: {
        padding: 15,
        
    },
    title: {
        fontSize: 32,
        color: "#52575D",
        fontWeight: "bold",
        fontStyle: "italic",
       
    },
});

export default TitleBar;
