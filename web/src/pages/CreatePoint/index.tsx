import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';

import {Map,  TileLayer, Marker} from 'react-leaflet';

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

interface Uf {
    name: string
}

const CreatePoint: React.FC = () => {

  const [itens, setItens] = useState<Itens[]>([]);
  const [ufList, setUfList ] = useState<string[]>([]);

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

  console.log(ufList);


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

            <form action="">
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
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div><div className="field">
                            <label htmlFor="whatsapp">Nome da entidade</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>   

                        <Map center={[-27.2092052, -49.6401092]} zoom={15}>
                            <TileLayer 
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[-27.2092052, -49.6401092]}/>
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado UF</label>
                                <select name="uf" id="uf">
                                    <option value="0">Selecione uma UF acima</option>
                                    {ufList.map(uf => 
                                        <option key={uf} value={uf}>{uf}</option>
                                    )}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Estado UF</label>
                                <select name="city" id="city">
                                    <option value="0">Selecione uma cidade</option>
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
                            <li key={item.id}>
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