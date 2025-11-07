package com.tnntruong.quiznote.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.VNPayService;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/payments/vnpay")
public class VNPayController {
    private final VNPayService vnPayService;

    public VNPayController(VNPayService vnPayService) {
        this.vnPayService = vnPayService;
    }

    @GetMapping("")
    public String home() {
        return "index";
    }

    @PostMapping("/submitOrder")
    public ResponseEntity<String> submidOrder(@RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":"
                + request.getServerPort();
        System.out.println(baseUrl);
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/vnpay-payment")
    public void GetMapping(HttpServletRequest request, HttpServletResponse response, Model model)
            throws IOException {
        try {
            System.out.println("VNPay callback received");

            int paymentStatus = vnPayService.orderReturn(request);

            String orderInfo = request.getParameter("vnp_OrderInfo");
            String paymentTime = request.getParameter("vnp_PayDate");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String totalPrice = request.getParameter("vnp_Amount");

            System.out.println("   Payment Status: " + paymentStatus);
            System.out.println("   Order Info: " + orderInfo);
            System.out.println("   Transaction ID: " + transactionId);
            System.out.println("   Amount: " + totalPrice);

            model.addAttribute("orderId", orderInfo);
            model.addAttribute("totalPrice", totalPrice);
            model.addAttribute("paymentTime", paymentTime);
            model.addAttribute("transactionId", transactionId);
            long amount = Long.parseLong(totalPrice) / 100;

            // Xây dựng URL redirect về frontend
            String frontendUrl = "http://localhost:5173/student/payment-result";

            if (paymentStatus == 1) {
                // Xử lý payment thành công
                vnPayService.handleSuccessfulPayment(orderInfo, transactionId, paymentTime, amount);

                // Redirect với thông tin thanh toán thành công
                String redirectUrl = String.format(
                        "%s?status=success&orderInfo=%s&transactionNo=%s&amount=%d&paymentTime=%s",
                        frontendUrl, orderInfo, transactionId, amount, paymentTime);

                System.out.println("Payment successful, redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            } else {
                // Redirect với thông báo thất bại
                String redirectUrl = String.format(
                        "%s?status=failed&orderInfo=%s&transactionNo=%s",
                        frontendUrl, orderInfo, transactionId);

                System.out.println("Payment failed, redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            }
        } catch (InvalidException e) {
            System.err.println("InvalidException in payment callback: " + e.getMessage());
            e.printStackTrace();
            String frontendUrl = "http://localhost:5173/student/payment-result";
            response.sendRedirect(frontendUrl + "?status=error&message=" + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error in payment callback: " + e.getMessage());
            e.printStackTrace();
            String frontendUrl = "http://localhost:5173/student/payment-result";
            response.sendRedirect(frontendUrl + "?status=error&message=Unexpected+error");
        }
    }

    // @GetMapping("/ipn")
    // public ResponseEntity<String> ipn(HttpServletRequest request) {
    // int paymentStatus = vnPayService.orderReturn(request);

    // String orderInfo = request.getParameter("vnp_OrderInfo");
    // String transactionId = request.getParameter("vnp_TransactionNo");
    // long amount = Long.parseLong(request.getParameter("vnp_Amount")) / 100;

    // if (paymentStatus == 1) {
    // vnPayService.handleSuccessfulPayment(orderInfo, transactionId,
    // request.getParameter("vnp_PayDate"), amount);
    // // phải trả về đúng chữ “OK” cho VNPay để họ ngừng gửi lại
    // return ResponseEntity.ok("OK");
    // }
    // return ResponseEntity.ok("FAILED");
    // }
}
