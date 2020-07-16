import React from "react"
import { Helmet } from "react-helmet"
import mealdb from "../mealdb-api"
import RecipeIngredients from "../components/RecipeIngredients"
import RecipeInstructions from "../components/RecipeInstructions"

export default class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipe: null, isLoading: true }
  }

  async componentDidMount() {
    var recipe = null
    try {
      recipe = await mealdb.getRecipe(this.props.match.params.recipeId)
    } catch (e) {
      recipe = null
    }
    this.setState({ recipe, isLoading: false })
  }

  compartir = (e) => {
    e.preventDefault()
    if (!navigator.share) {
      alert("Your browser can´t support Web Share API")
      return
    }

    const { recipe } = this.state

    navigator
      .share({
        title: `${recipe.name}`,
        text: "CookIt!",
        url: document.location.href,
      })
      .then(() => alert("Content shared!"))
      .catch((error) => alert("There was an error"))
  }

  render() {
    const { recipe, isLoading } = this.state

    if (isLoading) {
      return <div className="message">Loading...</div>
    } else if (recipe === null) {
      return <div className="message">There was a problem :P</div>
    }

    return (
      <div className="Recipe">
        <Helmet>
          <title>{recipe.name}</title>
        </Helmet>

        <div
          className="hero"
          style={{ backgroundImage: `url(${recipe.thumbnail})` }}
        />

        <div className="title">
          <div className="info">
            <h1>{recipe.name}</h1>
            <p>{recipe.origin}</p>
          </div>
          <div>
            <a className="share" onClick={this.compartir}>
              Share
            </a>
          </div>
        </div>

        <RecipeIngredients ingredients={recipe.ingredients} />

        <RecipeInstructions instructions={recipe.instructions} />
      </div>
    )
  }
}
