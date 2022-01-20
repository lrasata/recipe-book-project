package com.project.recipebook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.project.recipebook.IntegrationTest;
import com.project.recipebook.domain.IngredientOrder;
import com.project.recipebook.repository.IngredientOrderRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IngredientOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IngredientOrderResourceIT {

    private static final Long DEFAULT_AMOUNT_ORDER = 1L;
    private static final Long UPDATED_AMOUNT_ORDER = 2L;

    private static final String ENTITY_API_URL = "/api/ingredient-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IngredientOrderRepository ingredientOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIngredientOrderMockMvc;

    private IngredientOrder ingredientOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IngredientOrder createEntity(EntityManager em) {
        IngredientOrder ingredientOrder = new IngredientOrder().amountOrder(DEFAULT_AMOUNT_ORDER);
        return ingredientOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IngredientOrder createUpdatedEntity(EntityManager em) {
        IngredientOrder ingredientOrder = new IngredientOrder().amountOrder(UPDATED_AMOUNT_ORDER);
        return ingredientOrder;
    }

    @BeforeEach
    public void initTest() {
        ingredientOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createIngredientOrder() throws Exception {
        int databaseSizeBeforeCreate = ingredientOrderRepository.findAll().size();
        // Create the IngredientOrder
        restIngredientOrderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isCreated());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeCreate + 1);
        IngredientOrder testIngredientOrder = ingredientOrderList.get(ingredientOrderList.size() - 1);
        assertThat(testIngredientOrder.getAmountOrder()).isEqualTo(DEFAULT_AMOUNT_ORDER);
    }

    @Test
    @Transactional
    void createIngredientOrderWithExistingId() throws Exception {
        // Create the IngredientOrder with an existing ID
        ingredientOrder.setId(1L);

        int databaseSizeBeforeCreate = ingredientOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIngredientOrderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAmountOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = ingredientOrderRepository.findAll().size();
        // set the field null
        ingredientOrder.setAmountOrder(null);

        // Create the IngredientOrder, which fails.

        restIngredientOrderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIngredientOrders() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        // Get all the ingredientOrderList
        restIngredientOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ingredientOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].amountOrder").value(hasItem(DEFAULT_AMOUNT_ORDER.intValue())));
    }

    @Test
    @Transactional
    void getIngredientOrder() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        // Get the ingredientOrder
        restIngredientOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, ingredientOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ingredientOrder.getId().intValue()))
            .andExpect(jsonPath("$.amountOrder").value(DEFAULT_AMOUNT_ORDER.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingIngredientOrder() throws Exception {
        // Get the ingredientOrder
        restIngredientOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIngredientOrder() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();

        // Update the ingredientOrder
        IngredientOrder updatedIngredientOrder = ingredientOrderRepository.findById(ingredientOrder.getId()).get();
        // Disconnect from session so that the updates on updatedIngredientOrder are not directly saved in db
        em.detach(updatedIngredientOrder);
        updatedIngredientOrder.amountOrder(UPDATED_AMOUNT_ORDER);

        restIngredientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIngredientOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIngredientOrder))
            )
            .andExpect(status().isOk());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
        IngredientOrder testIngredientOrder = ingredientOrderList.get(ingredientOrderList.size() - 1);
        assertThat(testIngredientOrder.getAmountOrder()).isEqualTo(UPDATED_AMOUNT_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ingredientOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIngredientOrderWithPatch() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();

        // Update the ingredientOrder using partial update
        IngredientOrder partialUpdatedIngredientOrder = new IngredientOrder();
        partialUpdatedIngredientOrder.setId(ingredientOrder.getId());

        restIngredientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngredientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngredientOrder))
            )
            .andExpect(status().isOk());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
        IngredientOrder testIngredientOrder = ingredientOrderList.get(ingredientOrderList.size() - 1);
        assertThat(testIngredientOrder.getAmountOrder()).isEqualTo(DEFAULT_AMOUNT_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateIngredientOrderWithPatch() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();

        // Update the ingredientOrder using partial update
        IngredientOrder partialUpdatedIngredientOrder = new IngredientOrder();
        partialUpdatedIngredientOrder.setId(ingredientOrder.getId());

        partialUpdatedIngredientOrder.amountOrder(UPDATED_AMOUNT_ORDER);

        restIngredientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngredientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngredientOrder))
            )
            .andExpect(status().isOk());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
        IngredientOrder testIngredientOrder = ingredientOrderList.get(ingredientOrderList.size() - 1);
        assertThat(testIngredientOrder.getAmountOrder()).isEqualTo(UPDATED_AMOUNT_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ingredientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIngredientOrder() throws Exception {
        int databaseSizeBeforeUpdate = ingredientOrderRepository.findAll().size();
        ingredientOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngredientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingredientOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IngredientOrder in the database
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIngredientOrder() throws Exception {
        // Initialize the database
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        int databaseSizeBeforeDelete = ingredientOrderRepository.findAll().size();

        // Delete the ingredientOrder
        restIngredientOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, ingredientOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IngredientOrder> ingredientOrderList = ingredientOrderRepository.findAll();
        assertThat(ingredientOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
