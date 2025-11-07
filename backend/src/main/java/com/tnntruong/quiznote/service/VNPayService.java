package com.tnntruong.quiznote.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.config.VNPayConfig;
import com.tnntruong.quiznote.domain.PaymentTransaction;
import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqCreatePurchaseDTO;
import com.tnntruong.quiznote.repository.PaymentTransactionRepository;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class VNPayService {
    private VNPayConfig vnPayConfig;
    private PaymentTransactionRepository paymentRepo;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;
    private SellerProfileRepository sellerProfileRepository;
    private PurchaseService purchaseService;

    public VNPayService(VNPayConfig vnPayConfig, PaymentTransactionRepository paymentRepo,
            UserRepository userRepository, SubjectRepository subjectRepository,
            SellerProfileRepository sellerProfileRepository, PurchaseService purchaseService) {
        this.vnPayConfig = vnPayConfig;
        this.paymentRepo = paymentRepo;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.sellerProfileRepository = sellerProfileRepository;
        this.purchaseService = purchaseService;
    }

    public String createOrder(int total, String orderInfor, String urlReturn) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = vnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();
        String orderType = "order-type";
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(total * 100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfor);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

        // Xử lý return URL đúng cách
        String finalReturnUrl;
        if (vnPayConfig.vnp_ReturnUrl.startsWith("http://") || vnPayConfig.vnp_ReturnUrl.startsWith("https://")) {
            // Nếu vnp_ReturnUrl đã là full URL, dùng trực tiếp
            finalReturnUrl = vnPayConfig.vnp_ReturnUrl;
        } else {
            // Nếu là relative path, nối với baseUrl
            finalReturnUrl = urlReturn + vnPayConfig.vnp_ReturnUrl;
        }
        vnp_Params.put("vnp_ReturnUrl", finalReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getVnp_HashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }

    public int orderReturn(HttpServletRequest request) {
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = vnPayConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

    public void handleSuccessfulPayment(String orderInfo, String transactionNo,
            String paymentTime, long totalPrice) throws InvalidException {

        System.out.println("Processing payment - TransactionNo: " + transactionNo);
        System.out.println("OrderInfo: " + orderInfo);
        System.out.println("Amount: " + totalPrice);
        System.out.println("PaymentTime: " + paymentTime);

        if (paymentRepo.existsByTransactionNo(transactionNo)) {
            System.out.println("Transaction already exists, skip saving...");
            return;
        }

        Map<String, String> infoMap = parseOrderInfo(orderInfo);
        String buyerIdStr = infoMap.get("buyer");
        String subjectIdStr = infoMap.get("subject");

        if (buyerIdStr == null || subjectIdStr == null) {
            System.err.println("Invalid orderInfo format: " + orderInfo);
            throw new InvalidException("Invalid order information");
        }

        Long buyerId = Long.parseLong(buyerIdStr);
        Long subjectId = Long.parseLong(subjectIdStr);

        System.out.println("   BuyerId: " + buyerId + ", SubjectId: " + subjectId);

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> {
                    System.err.println("Buyer not found with id: " + buyerId);
                    return new RuntimeException("Buyer not found");
                });
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> {
                    System.err.println("Subject not found with id: " + subjectId);
                    return new RuntimeException("Subject not found");
                });
        User seller = subject.getSeller();

        PaymentTransaction tx = new PaymentTransaction();
        tx.setTransactionNo(transactionNo);
        tx.setOrderInfo(orderInfo);
        tx.setPaymentTime(paymentTime);
        tx.setAmount(totalPrice);
        tx.setStatus("SUCCESS");
        tx.setPaymentMethod("VNPAY");
        tx.setBuyer(buyer);
        tx.setSeller(seller);
        tx.setSubject(subject);
        tx.setCreatedAt(Instant.now());
        paymentRepo.save(tx);

        SellerProfile profile = sellerProfileRepository.findByUser(seller)
                .orElseGet(() -> {
                    SellerProfile sp = new SellerProfile();
                    sp.setUser(seller);
                    return sp;
                });

        profile.setPendingBalance(profile.getPendingBalance() + totalPrice);
        profile.setTotalRevenue(profile.getTotalRevenue() + totalPrice);
        sellerProfileRepository.save(profile);

        this.purchaseService.handleCreatePurchase(new ReqCreatePurchaseDTO(buyerId, subjectId));

        System.out.println("Payment saved successfully for order " + orderInfo);
    }

    private Map<String, String> parseOrderInfo(String orderInfo) {
        Map<String, String> map = new HashMap<>();
        String[] pairs = orderInfo.split(";");
        for (String pair : pairs) {
            String[] kv = pair.split(":");
            if (kv.length == 2) {
                map.put(kv[0], kv[1]);
            }
        }
        return map;
    }
}
