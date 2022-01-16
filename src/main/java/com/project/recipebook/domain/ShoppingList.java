package com.project.recipebook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * ShoppingList Entity
 */
@Schema(description = "ShoppingList Entity")
@Entity
@Table(name = "shopping_list")
public class ShoppingList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "shopping_status", nullable = false)
    private ShoppingStatus shoppingStatus;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
        name = "rel_shopping_list__ingredient",
        joinColumns = @JoinColumn(name = "shopping_list_id"),
        inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    @JsonIgnoreProperties(value = { "recipes", "shoppingLists" }, allowSetters = true)
    private Set<Ingredient> ingredients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ShoppingList id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ShoppingStatus getShoppingStatus() {
        return this.shoppingStatus;
    }

    public ShoppingList shoppingStatus(ShoppingStatus shoppingStatus) {
        this.setShoppingStatus(shoppingStatus);
        return this;
    }

    public void setShoppingStatus(ShoppingStatus shoppingStatus) {
        this.shoppingStatus = shoppingStatus;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ShoppingList user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Ingredient> getIngredients() {
        return this.ingredients;
    }

    public void setIngredients(Set<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }

    public ShoppingList ingredients(Set<Ingredient> ingredients) {
        this.setIngredients(ingredients);
        return this;
    }

    public ShoppingList addIngredient(Ingredient ingredient) {
        this.ingredients.add(ingredient);
        ingredient.getShoppingLists().add(this);
        return this;
    }

    public ShoppingList removeIngredient(Ingredient ingredient) {
        this.ingredients.remove(ingredient);
        ingredient.getShoppingLists().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShoppingList)) {
            return false;
        }
        return id != null && id.equals(((ShoppingList) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShoppingList{" +
            "id=" + getId() +
            ", shoppingStatus='" + getShoppingStatus() + "'" +
            "}";
    }
}
