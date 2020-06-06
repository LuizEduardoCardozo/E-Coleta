import React, {useState, useEffect, FormEvent, ChangeEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Map,  TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';

import axios from 'axios';

import api from '../../services/api';

import logo from '../../assets/logo.svg';

import {FiArrowLeft} from 'react-icons/fi'

// import { Container } from './styles';

import './styles.css';

interface Itens {
    id: number,
    nome: string,
    image_url: string,
}

interface IBGEUFResponse {
    sigla: string,
}

interface IBGECityResponse {
    nome: string,
}

interface Uf {
    name: string
}

const CreatePoint: React.FC = () => {

  const [itens, setItens] = useState<Itens[]>([]);
  const [ufList, setUfList ] = useState<string[]>([]);
  const [cityList, setCityList] = useState<string[]>([]);

  const [ selectedUf, setSelectedUf ] = useState('0');
  const [ selectedCity, setSelectedCity] = useState('0');

  const [ selectedItens, setSelectedItens ] = useState<number[]>([])

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-27.2092052, -49.6401092]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([-27.2092052, -49.6401092]);

  const [formData, setFormData ] = useState({name: '',email: '', whatsapp: '',});

  const history = useHistory();

  useEffect(() => {
    api.get('itens').then(response => {
        setItens(response.data);
    });
  }, []) 

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfList(ufInitials);
    })
  }, []);

  useEffect(() => {

    if(selectedUf === '0') return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const cityListResponse = response.data.map(city => city.nome);
        setCityList(cityListResponse)
    })
  }, [selectedUf]);

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(position => {
        const {longitude, latitude} = position.coords;
        setInitialPosition([latitude, longitude]);
      });
  }, [])

  function handleSelectUf(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(e.target.value);
  }

  function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(e.target.value);
  }

  function handleMapClick(e: LeafletMouseEvent) {
    setSelectedPosition([e.latlng.lat, e.latlng.lng]);
  }
  
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      const {name, value } = e.target;
      setFormData({...formData, [name]: value});
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItens.findIndex(item => item === id);

    // console.log(alreadySelected);

    if(alreadySelected !== -1) {
        const filteredItens = selectedItens.filter(item => item !== id);
        setSelectedItens(filteredItens);
    } else {
        setSelectedItens([...selectedItens, id]);
    }

  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const {name, email, whatsapp} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [longitude, latitude] = selectedPosition;
    const itens = selectedItens;

    const data = {
        nome: name,
        email,
        whatsapp,
        uf,
        city,
        longitude,
        latitude,
        itens,
    }

    console.log(data);
    await api.post('/points',data);
    history.goBack();

  }

  return (
      <>
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div><div className="field">
                            <label htmlFor="whatsapp">Nome da entidade</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>   

                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer 
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition}/>
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado UF</label>
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                    <option value="0">Selecione uma UF acima</option>
                                    {ufList.map(uf => 
                                        <>
                                        <option key={uf} value={uf}>{uf}</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Estado UF</label>
                                <select value={selectedCity} onChange={handleSelectedCity} name="city" id="city">
                                    <option value="0">Selecione uma cidade</option>
                                    {cityList.map(city => 
                                        <>
                                            <option key={city} value={city}>{city}</option>
                                        </>    
                                    )}
                                </select>
                            </div>
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {itens.map(item => (
                            <li 
                            key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItens.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt="Oleo"/>
                                <span>{item.nome}</span>
                            </li>
                        ))
                        }


                    </ul>

                </fieldset>

                <button>Cadastrar ponto de coleta</button>

            </form>

        </div>
      </>
  );
}

export default CreatePoint;