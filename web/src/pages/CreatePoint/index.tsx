import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputMask from 'react-input-mask';
import * as yup from 'yup';

import api from '../../services/api';
import Loading from '../../components/Loading';
import Dropzone from '../../components/Dropzone';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

const pointSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  whatsapp: yup.number().required(),
  uf: yup.string().required(),
  city: yup.string().required(),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  items: yup.array().required(),
});

const MySwal = withReactContent(Swal);

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    const options = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
      },
      (error) => {
        console.error(error);
        alert(error.message);
      },
      options
    );
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((persmissionStatus) => {
        const state = persmissionStatus.state;
        console.log(`Geolocalization is ${state}`);
      });
  }, []);

  useEffect(() => {
    api.get('/api/items').then((response: any) => {
      setItems(response.data.serializedItems);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response: any) => {
        const ufInitials = response.data.map((uf: any) => uf.sigla);
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
          const citiesNames = response.data.map((city: any) => city.nome);
          setCities(citiesNames);
        });
    }
  }, [selectedUf]);

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLInputElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name: inputName, value: inputValue } = event.target;
    setFormData({ ...formData, [inputName]: inputValue });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.find((item) => item === id);
    if (alreadySelected) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const submittedData = new FormData();

    const serializedWhatsapp = whatsapp.replace(/(\()|-|\)/g, '');
    submittedData.append('name', name);
    submittedData.append('email', email);
    submittedData.append('whatsapp', serializedWhatsapp);
    submittedData.append('uf', uf);
    submittedData.append('city', city);
    submittedData.append('latitude', String(latitude));
    submittedData.append('longitude', String(longitude));
    submittedData.append('items', items.join(','));

    if (selectedFile) {
      submittedData.append('image', selectedFile);
    }

    try {
      await api.post('/api/points', submittedData);
      MySwal.fire({
        icon: 'success',
        title: <p>Ponto cadastrado com sucesso</p>,
      });
      history.push('/');
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: <p>Oops! Algo deu errado, revise os dados e tente novamente</p>,
      });
    }

    setLoading(false);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta logo" />
        <nav>
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </nav>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <section className="form-section">
          <div className="form-section-header">
            <h2>Dados</h2>
          </div>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Nome da Entidade"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Seu e-mail de contato"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <InputMask
                type="text"
                mask="(99)99999-9999"
                name="whatsapp"
                id="whatsapp"
                alwaysShowMask
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-header">
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </div>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estados(UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={handleSelectUF}
                value={selectedUf}
              >
                <option>Selecione um Estado</option>
                {ufs.map((uf, index) => (
                  <option key={index} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                list="data"
                onChange={handleSelectCity}
              />
              <datalist id="data">
                {cities.map((city, index) => (
                  <option key={index} value={city} />
                ))}
              </datalist>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-header">
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </div>

          <ul className="grid-items">
            {items.map((item) => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <button type="submit">
          {loading ? <Loading /> : 'Cadastrar ponto de coleta'}
        </button>
      </form>
    </div>
  );
};

export default CreatePoint;
