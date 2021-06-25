import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import mime from 'mime';
const API_URL = 'http://192.168.1.163:3000/upload';
const App = () => {
  const [imgf, setImage] = useState([]);

  const chooseImage = type => {
    if (type === 'library') {
      launchImageLibrary({mediaType: 'photo', selectionLimit: 2}, res => {
        setImage([...imgf, ...res.assets]);
      });
    } else {
      launchCamera({mediaType: 'photo', quality: 0.5}, res => {
        console.log(res.assets);
        setImage([...imgf, res.assets[0]]);
      });
    }
  };

  const upload = () => {
    let formData = new FormData();

    imgf.forEach((item, i) => {
      const newImageUri =
        Platform.OS === 'android' ? item.uri : item.uri.replace('file://', '');

      formData.append('files', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
    });

    const header = {
      'Content-Type': 'multipart/form-data',
    };
    axios.post(API_URL, formData, header);
  };

  const deleteImage = item => {
    const arr = imgf.filter(itemc => {
      return item !== itemc;
    });
    setImage(arr);
  };

  const renderImage = item => {
    return (
      <View style={{marginTop: 10}}>
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.img}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.img_closer}
          onPress={() => deleteImage(item)}>
          <View>
            <Text style={{color: '#fff', fontSize: 15}}>X</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItems = () => {
    if (imgf.length > 0) {
      return (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={imgf}
          renderItem={item => renderImage(item.item)}
          numColumns={3}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={StyleSheet.container}>
      <View style={styles.header}>
        <Text>PHOTO UPLOAD</Text>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              chooseImage('library');
            }}>
            <Text>SELECT FROM GALLERY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              chooseImage('cam');
            }}>
            <Text>TAKE PHOTO</Text>
          </TouchableOpacity>
        </View>

        {renderItems()}

        <View>
          <TouchableOpacity
            style={[styles.button, {marginTop: 20, borderRadius: 6}]}
            onPress={() => upload()}>
            <Text> Upload </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonArea: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ccc',
    padding: 15,
    marginHorizontal: 5,
  },
  img: {
    minHeight: 100,
    minWidth: 100,
    marginHorizontal: 10,
  },
  img_closer: {
    position: 'absolute',
    right: 0,
    top: -10,
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
