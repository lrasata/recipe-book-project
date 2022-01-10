package com.project.recipebook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * Ingredient Entity
 */
@Schema(description = "Ingredient Entity")
@Entity
@Table(name = "ingredient")
public class Ingredient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "amount")
    private Long amount;

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnoreProperties(value = { "user", "ingredient" }, allowSetters = true)
    private Set<Recipe> recipes = new HashSet<>();

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnoreProperties(value = { "user", "ingredient" }, allowSetters = true)
    private Set<ShoppingList> shoppingLists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ingredient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Ingredient name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getAmount() {
        return this.amount;
    }

    public Ingredient amount(Long amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Set<Recipe> getRecipes() {
        return this.recipes;
    }

    public void setRecipes(Set<Recipe> recipes) {
        if (this.recipes != null) {
            this.recipes.forEach(i -> i.setIngredient(null));
        }
        if (recipes != null) {
            recipes.forEach(i -> i.setIngredient(this));
        }
        this.recipes = recipes;
    }

    public Ingredient recipes(Set<Recipe> recipes) {
        this.setRecipes(recipes);
        return this;
    }

    public Ingredient addRecipe(Recipe recipe) {
        this.recipes.add(recipe);
        recipe.setIngredient(this);
        return this;
    }

    public Ingredient removeRecipe(Recipe recipe) {
        this.recipes.remove(recipe);
        recipe.setIngredient(null);
        return this;
    }

    public Set<ShoppingList> getShoppingLists() {
        return this.shoppingLists;
    }

    public void setShoppingLists(Set<ShoppingList> shoppingLists) {
        if (this.shoppingLists != null) {
            this.shoppingLists.forEach(i -> i.setIngredient(null));
        }
        if (shoppingLists != null) {
            shoppingLists.forEach(i -> i.setIngredient(this));
        }
        this.shoppingLists = shoppingLists;
    }

    public Ingredient shoppingLists(Set<ShoppingList> shoppingLists) {
        this.setShoppingLists(shoppingLists);
        return this;
    }

    public Ingredient addShoppingList(ShoppingList shoppingList) {
        this.shoppingLists.add(shoppingList);
        shoppingList.setIngredient(this);
        return this;
    }

    public Ingredient removeShoppingList(ShoppingList shoppingList) {
        this.shoppingLists.remove(shoppingList);
        shoppingList.setIngredient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ingredient)) {
            return false;
        }
        return id != null && id.equals(((Ingredient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ingredient{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", amount=" + getAmount() +
            "}";
    }
}
