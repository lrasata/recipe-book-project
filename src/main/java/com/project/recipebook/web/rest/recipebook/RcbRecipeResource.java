package com.project.recipebook.web.rest.recipebook;

import java.util.List;

import com.project.recipebook.domain.Recipe;
import com.project.recipebook.repository.RecipeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for managing {@link com.project.recipebook.domain.Recipe}.
 */
@RestController
@RequestMapping("/api/rcb")
@Transactional
public class RcbRecipeResource {
    private final Logger log = LoggerFactory.getLogger(RcbRecipeResource.class);

    private static final String ENTITY_NAME = "rcbrecipe";
    private final RecipeRepository recipeRepository;

    public RcbRecipeResource(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

        /**
     * {@code GET  /recipes} : get all the recipes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of recipes in body.
     */
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        log.debug("REST request to get a list of Recipes");
        List<Recipe> recipes = this.recipeRepository.findAllWithEagerRelationships();

        return ResponseEntity.ok().body(recipes);
    }
    
}