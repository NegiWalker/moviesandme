import React from 'react'
import { View, TextInput, Button } from 'react-native'
import { StyleSheet  } from 'react-native'
import { FlatList, Text } from 'react-native'
import FilmItem from './FilmItem'
import 'react-json-pretty/themes/adventure_time.css'
import JSONPretty from 'react-json-pretty'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { ActivityIndicator } from 'react-native'

class Search extends React.Component {
    
    // ajouter la prop films, une liste vide au départ
    constructor(props) {
        super(props)
        this.state = { films: [],      // ceci va devenir un state
        isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
        }
        this.searchedText = ''
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API
    }

    _searchTextInputChanged(text) {
        this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par setState
    }

    _searchFilms() {
      this.page = 0
      this.totalPages = 0

      // setState est une fonction asychrone
      // Pour améliorer les performances React peut en différer les traitements
      // Elle prend un deuxième paramètre
      //      une fonction callback qui est appelée lorsque tout est prêt
      this.setState({
          films: [],
        }, () => {
            console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            this._loadFilms()
        })
    }

    _loadFilms() {
        if (this.searchedText.length > 0 && !this.state.isLoading) {
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then((data) => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({ 
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                });
            });
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
        return (
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
            {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
          </View>
        )}
    }

    render() {
        return (
            <View style={{ marginTop: 20, flex: 1 }}>
                <TextInput
                    placeholder="Titre du film"
                    style={ styles.textinput }
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    onSubmitEditing={() => this._searchFilms()}
                />
                <Button title='Rechercher' onPress={() => this._searchFilms()}/>
                <FlatList
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                          this._loadFilms() }}}
				    keyExtractor={(item) => item.listId}
				    data={this.state.films}
                    renderItem={({ item }) => <FilmItem film={item} />}
				/>
                { this._displayLoading() }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        marginTop: 20,
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5,
    },
      loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Search