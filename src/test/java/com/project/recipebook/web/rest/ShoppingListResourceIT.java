package com.project.recipebook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.project.recipebook.IntegrationTest;
import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.repository.ShoppingListRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShoppingListResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ShoppingListResourceIT {

    private static final String ENTITY_API_URL = "/api/shopping-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Mock
    private ShoppingListRepository shoppingListRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShoppingListMockMvc;

    private ShoppingList shoppingList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShoppingList createEntity(EntityManager em) {
        ShoppingList shoppingList = new ShoppingList();
        return shoppingList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShoppingList createUpdatedEntity(EntityManager em) {
        ShoppingList shoppingList = new ShoppingList();
        return shoppingList;
    }

    @BeforeEach
    public void initTest() {
        shoppingList = createEntity(em);
    }

    @Test
    @Transactional
    void createShoppingList() throws Exception {
        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();
        // Create the ShoppingList
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isCreated());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
    }

    @Test
    @Transactional
    void createShoppingListWithExistingId() throws Exception {
        // Create the ShoppingList with an existing ID
        shoppingList.setId(1L);

        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShoppingLists() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        // Get all the shoppingListList
        restShoppingListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shoppingList.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShoppingListsWithEagerRelationshipsIsEnabled() throws Exception {
        when(shoppingListRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShoppingListMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(shoppingListRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShoppingListsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(shoppingListRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShoppingListMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(shoppingListRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getShoppingList() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        // Get the shoppingList
        restShoppingListMockMvc
            .perform(get(ENTITY_API_URL_ID, shoppingList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shoppingList.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingShoppingList() throws Exception {
        // Get the shoppingList
        restShoppingListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewShoppingList() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShoppingListWithPatch() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList using partial update
        ShoppingList partialUpdatedShoppingList = new ShoppingList();
        partialUpdatedShoppingList.setId(shoppingList.getId());

        restShoppingListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShoppingList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateShoppingListWithPatch() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList using partial update
        ShoppingList partialUpdatedShoppingList = new ShoppingList();
        partialUpdatedShoppingList.setId(shoppingList.getId());

        restShoppingListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShoppingList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shoppingList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShoppingList() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeDelete = shoppingListRepository.findAll().size();

        // Delete the shoppingList
        restShoppingListMockMvc
            .perform(delete(ENTITY_API_URL_ID, shoppingList.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
