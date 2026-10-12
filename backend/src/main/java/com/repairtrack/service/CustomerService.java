package com.repairtrack.service;

import com.repairtrack.dto.CustomerDTO;
import com.repairtrack.dto.CustomerRequest;
import com.repairtrack.entity.Customer;
import com.repairtrack.entity.RepairStatus;
import com.repairtrack.exception.DuplicateRecordException;
import com.repairtrack.exception.ResourceNotFoundException;
import com.repairtrack.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> searchCustomers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCustomers();
        }
        return customerRepository.searchCustomers(query.trim())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = getCustomerEntityById(id);
        return mapToDTO(customer);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerEntityById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public CustomerDTO createCustomer(CustomerRequest request) {
        // Duplicate check on phone
        if (customerRepository.existsByPhone(request.getPhone().trim())) {
            throw new DuplicateRecordException("A customer with phone number '" + request.getPhone() + "' already exists.");
        }

        // Duplicate check on email if provided
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (customerRepository.existsByEmail(request.getEmail().trim())) {
                throw new DuplicateRecordException("A customer with email '" + request.getEmail() + "' already exists.");
            }
        }

        Customer customer = new Customer();
        customer.setName(request.getName().trim());
        customer.setPhone(request.getPhone().trim());
        customer.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        customer.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        customer.setCity(request.getCity() != null ? request.getCity().trim() : null);
        customer.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Customer saved = customerRepository.save(customer);
        return mapToDTO(saved);
    }

    public CustomerDTO updateCustomer(Long id, CustomerRequest request) {
        Customer customer = getCustomerEntityById(id);

        // Duplicate phone check against other records
        if (customerRepository.existsByPhoneAndIdNot(request.getPhone().trim(), id)) {
            throw new DuplicateRecordException("Another customer already has phone number: " + request.getPhone());
        }

        // Duplicate email check against other records
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (customerRepository.existsByEmailAndIdNot(request.getEmail().trim(), id)) {
                throw new DuplicateRecordException("Another customer already has email: " + request.getEmail());
            }
        }

        customer.setName(request.getName().trim());
        customer.setPhone(request.getPhone().trim());
        customer.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        customer.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        customer.setCity(request.getCity() != null ? request.getCity().trim() : null);
        customer.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Customer saved = customerRepository.save(customer);
        return mapToDTO(saved);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerEntityById(id);
        customerRepository.delete(customer);
    }

    public CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setNotes(customer.getNotes());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        if (customer.getDevices() != null) {
            dto.setDeviceCount(customer.getDevices().size());
            int activeRepairs = (int) customer.getDevices().stream()
                    .filter(d -> d.getRepairs() != null)
                    .flatMap(d -> d.getRepairs().stream())
                    .filter(r -> r.getStatus() != RepairStatus.DELIVERED && r.getStatus() != RepairStatus.CANCELLED)
                    .count();
            dto.setActiveRepairsCount(activeRepairs);
        } else {
            dto.setDeviceCount(0);
            dto.setActiveRepairsCount(0);
        }

        return dto;
    }
}
