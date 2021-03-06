package com.project.recipebook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * Ingredient Order Entity
 */
@Schema(description = "Ingredient Order Entity")
@Entity
@Table(name = "ingredient_order")
public class IngredientOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "amount_order", nullable = false)
    private Long amountOrder;

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties(value = { "recipes" }, allowSetters = true)
    private Ingredient ingredient;

    @ManyToMany(mappedBy = "ingredientOrders")
    @JsonIgnoreProperties(value = { "user", "ingredientOrders" }, allowSetters = true)
    private Set<ShoppingList> shoppingLists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IngredientOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAmountOrder() {
        return this.amountOrder;
    }

    public IngredientOrder amountOrder(Long amountOrder) {
        this.setAmountOrder(amountOrder);
        return this;
    }

    public void setAmountOrder(Long amountOrder) {
        this.amountOrder = amountOrder;
    }

    public Ingredient getIngredient() {
        return this.ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public IngredientOrder ingredient(Ingredient ingredient) {
        this.setIngredient(ingredient);
        return this;
    }

    public Set<ShoppingList> getShoppingLists() {
        return this.shoppingLists;
    }

    public void setShoppingLists(Set<ShoppingList> shoppingLists) {
        if (this.shoppingLists != null) {
            this.shoppingLists.forEach(i -> i.removeIngredientOrder(this));
        }
        if (shoppingLists != null) {
            shoppingLists.forEach(i -> i.addIngredientOrder(this));
        }
        this.shoppingLists = shoppingLists;
    }

    public IngredientOrder shoppingLists(Set<ShoppingList> shoppingLists) {
        this.setShoppingLists(shoppingLists);
        return this;
    }

    public IngredientOrder addShoppingList(ShoppingList shoppingList) {
        this.shoppingLists.add(shoppingList);
        shoppingList.getIngredientOrders().add(this);
        return this;
    }

    public IngredientOrder removeShoppingList(ShoppingList shoppingList) {
        this.shoppingLists.remove(shoppingList);
        shoppingList.getIngredientOrders().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IngredientOrder)) {
            return false;
        }
        return id != null && id.equals(((IngredientOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IngredientOrder{" +
            "id=" + getId() +
            ", amountOrder=" + getAmountOrder() +
            "}";
    }
}
