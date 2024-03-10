import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";

import { Text, View } from "@/components/Themed";
import {Button, Searchbar, Surface} from "react-native-paper";
import React, {useEffect, useState} from "react";
import Calls from "@/utils/api/client";
import {ResponseData} from "@/utils/cache";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {REGISTRATION_KEY} from "@/app/register";
import {useRouter} from "expo-router";
import Colors from "@/constants/Colors";

type userId = {
  userId: string
}

export default function App() {
  const { getItem } = useAsyncStorage(REGISTRATION_KEY);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [contacts, setContacts] = useState<userId[]>([]);

  useEffect(() => {
    getItem().then((res) => {
      setUserId(res);
    });
  }, []);

  async function fetchContacts(){
    console.log(searchQuery);
    let response;
    try {
      response = await Calls.post<any>(
          "https://hog9cqd8ol.execute-api.eu-west-1.amazonaws.com/default/getUsers",
          {},
          {params: {userId: searchQuery}}
      );
    } catch (error) {
      console.log(error);
      return;
    }

    if (response.status !== 200) {
      console.log("Error fetching data");
      return;
    }

    const users = response.data as userId[];
    console.log("Contacts: " + users);
    setContacts(users);
  }

  const router = useRouter()

  function navigateToNavigation(userId: string) {
    router.push({
      pathname: "/navigation",
      params: {
        friendUserId: userId
      },
    })
  }

  return (
    <View style={styles.container}>
      <Searchbar
          style={styles.searchBar}
          placeholder="Hledej uzivatele"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onBlur={fetchContacts}
      />

    <ScrollView >
      {contacts.map((contact) => <Surface key={contact.userId} style={styles.surface} elevation={4}>
        <Button style={{backgroundColor: Colors.contacts.background}} labelStyle={{color: Colors.contacts.color}}  icon="phone" mode="contained" onPress={() => console.log('Calling'+ contact)}>
          Volat
        </Button>
        <Text style={styles.text}>
        {contact.userId}
        </Text>
        <Button
            style={{backgroundColor: Colors.navigation.background}} labelStyle={{color: Colors.navigation.color}}
            icon="human-greeting-proximity" mode="contained" onPress={() =>navigateToNavigation(contact.userId)}
                contentStyle={{flexDirection: 'row-reverse'}}
        >
          Propojit
        </Button>
      </Surface>)}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  surface: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    height: 80,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar:{
    marginBottom: 10
  }
});
