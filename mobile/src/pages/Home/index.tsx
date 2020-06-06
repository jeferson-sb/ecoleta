import React, { useState, useEffect } from 'react';
import { RectButton } from 'react-native-gesture-handler';
import {
  Text,
  Image,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
  sigla: string;
}

interface IPicker {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [selectedUf, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [ufs, setUfs] = useState<IPicker[]>([]);
  const [cities, setCities] = useState<IPicker[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response: any) => {
        const ufInitials = response.data.map((uf: any) => {
          return { label: uf.sigla, value: uf.sigla };
        });
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf !== '0') {
      axios
        .get<string[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        )
        .then((response: any) => {
          const citiesNames = response.data.map((city: any) => {
            return { label: city.nome, value: city.nome };
          });
          setCities(citiesNames);
        });
    }
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coletas de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedUF(value)}
            items={ufs}
            placeholder={{ label: 'Selecione a UF', value: null }}
          />
          <RNPickerSelect
            onValueChange={(value) => setSelectedCity(value)}
            placeholder={{ label: 'Selecione a Cidade', value: null }}
            items={cities}
          />
          <RectButton
            style={styles.button}
            onPress={() =>
              navigation.navigate('Points', {
                uf: selectedUf,
                city: selectedCity,
              })
            }
          >
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
