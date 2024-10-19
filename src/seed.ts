import { PrismaClient } from "@prisma/client";

async function main() {
	const prisma = new PrismaClient();
	await prisma.$connect();
	await prisma.branch.deleteMany();

	const seeds: {
		name: string;
		trademark: string;
		description: string[];
		url: string;
		province: string;
		ward: string;
		best_comforts: string[];
		location: string;
		images: string[];
	}[] = [
		{
			trademark: "manor_villas",
			name: "The Manor Villas Đà Lạt",
			url: "the-manor-villas-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Có lẽ đâu đó trong thẳm sâu, mỗi người chúng ta đều có giấc mơ về một nơi chốn bình yên, vắng xa những ồn ào, hối hả của phố thị. Một nơi ta có thể “nằm nghe nắng mưa” hay nhàn nhã ngắm sao trời.",
				"The Manor Villas Dalat đích thị là tận hưởng không gian kiến trúc theo phong cách Pháp cổ điển sang trọng khiến bao người đều say đắm, nơi chốn an yên giữa nhân gian náo nhiệt, rực rỡ. Nằm lọt thỏm giữa 1 bên là đồi thông xanh bạt ngàn, 1 bên hiện đại. Với không gian rộng rãi và sạch sẽ chuẩn phong cách châu Âu. Hơn thế, nhiều phòng của villa còn có bồn tắm, xung quanh phòng được lát kính hoàn toàn để bạn tha hồ chiêm ngưỡng ngay chiếc view toàn cảnh thành phố mộng mơ.",
				"Ở đây, bạn sẽ được ngắm cao nguyên Lâm Viên từ trên cao vô cùng mãn nhãn. Khung cảnh bao quát núi đồi chập chùng, những nếp nhà nhỏ nhắn, xa xa là cánh rừng thông xanh mướt bạt ngàn, mọi khoảnh khắc đặc biệt trong ngày, dù là bình minh buổi sớm hay hoàng hôn dần phai thì bạn đều có thể thảnh thơi nhấm nháp ly cà phê và chiêm ngưỡng khung cảnh hết sức lãng mạn, thi vị và hữu tình. Đặc biệt vào mỗi sáng, bạn sẽ được trải nghiệm “săn mây tận giường” với áng mây lờ lờ trôi ảo diệu. Còn buổi chiều sẽ được “thưởng thức” khoảnh khắc hoàng hôn cực lãng mạn.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "new_life",
			name: "New Life Hotel Đà Lạt",
			url: "new-life-hotel-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Hãy làm một chuyến lang thang thú vị và khám phá điều kỳ diệu của Đà Lạt với việc ở lại Khách Sạn New Life Đà Lạt. Khám phá Đà Lạt đích thực mà hầu hết du khách không bao giờ thấy khi ở lại Khách Sạn New Life Đà Lạt, nằm cách chợ Đà Lạt chỉ 2,0 km.",
				"Khách Sạn New Life Đà Lạt cung cấp một loạt dịch vụ và tiện nghi để giúp kỳ nghỉ của quý khách thoải mái hơn. Giữ liên lạc trong suốt kỳ nghỉ của quý khách với việc được truy cập internet miễn phí. Dịch vụ đưa đón sân bay có thể được đặt trước ngày nhận phòng của quý khách, để đảm bảo việc đến hoặc đi được suôn sẻ và thuận tiện. Các dịch vụ taxi do khách sạn cung cấp giúp cho việc khám phá Đà Lạt trở nên thuận tiện hơn.",
				"Có chỗ đỗ xe, do khách sạn cung cấp cho những khách lái xe riêng. Khách sạn cung cấp các dịch vụ quầy lễ tân như két sắt, nhận phòng hoặc trả phòng nhanh và giữ hành lý để tạo sự thuận tiện cho khách. Dễ dàng mua vé cho các hoạt động giải trí tốt nhất của thành phố qua chuyến du lịch và dịch vụ vé của khách sạn. Có thể đóng gói đồ đạc nhẹ nhàng tại Khách Sạn New Life Đà Lạt nhờ việc dịch vụ giặt khô và dịch vụ giặt là của khách sạn giữ cho quần áo của quý khách luôn sạch sẽ.",
				"Khách sạn cũng cung cấp nước đóng chai, cà phê hòa tan và tủ lạnh nhỏ chứa đồ uống, trà hòa tan và tủ lạnh trong một số phòng khi quý khách thấy cần. Khách Sạn New Life Đà Lạt cũng cung cấp khăn tắm, máy sấy tóc và vật dụng tắm rửa trong phòng tắm cho các phòng chọn lọc. Phòng chờ thương gia là tiện ích thêm cho khách nghỉ, mang đến bầu không khí đặc biệt thoải mái và đầy đủ tiện nghi để thư giãn.",
				"New Life chắc chắn sẽ đem đến cho bạn cùng bạn bè, gia đình một kỳ nghỉ tại thành phố ngàn hoa một cách trọn vẹn nhất.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "gate_boutique_da_lat",
			name: "The Gate Boutique Hotel Đà lạt",
			url: "the-gate-boutique-hotel-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Đã bao giờ bạn đi Đà Lạt mà chọn được 1 nơi lưu trú vừa ở trung tâm, lại vừa có view 4 phía là rừng thông đậm chất Đà Lạt. Bên trong là nhà, mở cửa là vườn, săn mây tại giường, mà còn cung ứng tất cả mọi dịch vụ mà bạn cần cho 1 chuyến du lịch lý tưởng?",
				"The Gate Hotel Đà Lạt chính là cánh cổng mở ra một nơi như thế. Khi chọn The Gate, bạn sẽ được đáp ứng đủ mọi tiêu chí và nhu cầu cần thiết:",
				"• Vị trí ở gần trung tâm thành phố, gần các địa điểm check-in và vui chơi nổi tiếng của Đà Lạt. Chỉ cách chợ Đà Lạt 1,5km",
				"• Khách sạn có view đồi thông, có thể săn mây và ngắm hoàng hôn tại phòng",
				"• Các hạng phòng đa dạng dành cho cặp đôi nhiều sự lựa chọn và mức giá",
				"• Dịch vụ cho thuê xe máy",
				"• Dịch vụ đưa đón sân bay - tận nơi khách sạn",
				"The Gate Hotel Đà Lạt - cánh cổng mang cả Đà Lạt đến với bạn. Hãy đến với The Gate để tận hưởng kì nghỉ tuyệt vời nhất của bạn và người thương. Hộp thư của chúng tôi luôn sẵn sàng trả lời thắc mắc của bạn bất cứ lúc nào.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "gate_boutique_sapa",
			name: "The Gate Boutique Hotel Sapa",
			url: "the-gate-boutique-hotel-sapa",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Được thành lập từ năm 2023, tọa lạc tại trung tâm Thị trấn Sa Pa, nằm liền kề với Công viên Trung tâm, nơi lý tưởng nhất dành cho khách du lịch trong nước và quốc tế để trải nghiệm văn hóa, cuộc sống và cảnh đẹp thiên nhiên tại Sa Pa.",
				"Với 20 phòng nghỉ với kiến trúc và nội thất được thiết kế theo phong cách pha trộn giữa kiến trúc Pháp xinh đẹp và bản sắc địa phương cùng với ở vị trí đắc địa giữa trung tâm thị trấn, trước mặt là nhà thờ đá - nơi diễn ra phiên chợ tình của người dân tộc vào cuối tuần, núi Hàm Rồng, núi Chân Mây, cổng trời, The Gate Boutique Sapa chắc chắn sẽ mang lại sự hài lòng cho mọi nhu cầu của du khách",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "gold_view",
			name: "Gold View Hotel Đà Lạt",
			url: "gold-view-hotel-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Nằm ngay trung tâm thành phố Đà Lạt, khách sạn Gold View sở hữu vị trí với tầm nhìn tuyệt đẹp với khung cảnh thung lũng, núi đồi. Mang lại những khoảnh khắc tuyệt đẹp lúc bình minh cũng như hoàng hôn. Đội ngũ nhân viên thân thiện luôn hết lòng hỗ trợ Quý khách với hy vọng mang lại cảm giác thoải mái nhất dành cho Quý khách. Cùng Gold View lưu giữ lại những khoảnh khắc đáng nhớ nhất khi đến thành phố Đà Lạt.",
				"Các tiện ích: Hãy thư thả ngắm cảnh từ sân thượng/sân hiên hay vườn; và tận hưởng những dịch vụ, tiện ích như truy cập Internet không dây miễn phí.",
				"Phòng nghỉ: Hãy nghỉ ngơi thoải mái như đang ở nhà mình tại một trong 22 phòng trang trí khác biệt với tủ lạnh và TV màn hình phẳng. Giường nệm có lớp đệm bông được trang bị bộ đồ giường cao cấp. Quý vị sẽ luôn có thể giữ liên lạc bằng truy cập Internet không dây miễn phí ngay tại phòng. Các phòng tắm được trang bị buồng tắm vòi sen với vòi sen phun mưa và đồ dùng nhà tắm miễn phí.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "moon_valley_villas",
			name: "Moon Valley Villas Đà Lạt",
			url: "moon-valley-villas-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Moon Valley Villas tọa lạc tại số 31C Đặng Thái Thân, Phường 3, Đà Lạt, Việt Nam. Nằm ngay trung tâm thành phố Đà Lạt, khách sạn sở hữu vị trí với tầm nhìn tuyệt đẹp với khung cảnh thung lũng, núi đồi. Mang lại những khoảnh khắc tuyệt đẹp lúc bình minh cũng như hoàng hôn. Đội ngũ nhân viên thân thiện luôn hết lòng hỗ trợ Quý khách với hy vọng mang lại cảm giác thoải mái nhất dành cho Quý khách. Cùng Moon Valley lưu giữ lại những khoảnh khắc đáng nhớ nhất khi đến thành phố Đà Lạt.",
				"Các tiện ích: Hãy thư thả ngắm cảnh từ ban công, sân hiên hay vườn; và tận hưởng những dịch vụ, tiện ích như truy cập Internet không dây miễn phí.",
				"Phòng nghỉ: Hãy nghỉ ngơi thoải mái như đang ở nhà mình tại một trong các phòng trang trí khác biệt với tủ lạnh và TV màn hình phẳng. Giường nệm có lớp đệm bông được trang bị bộ đồ giường cao cấp. Quý vị sẽ luôn có thể giữ liên lạc bằng truy cập Internet không dây miễn phí ngay tại phòng. Các phòng tắm được trang bị buồng tắm vòi sen với vòi sen phun mưa và đồ dùng nhà tắm miễn phí.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "yukkuri_boutique",
			name: "Yukkuri Boutique Hotel Đà lạt",
			url: "yukkuri-boutique-hotel-da-lat",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			description: [
				"Khách sạn YUKKURI Boutique Đà Lạt cung cấp các dịch vụ quầy lễ tân như nhận phòng hoặc trả phòng nhanh và giữ hành lý để tạo sự thuận tiện cho khách. Có thể đóng gói đồ đạc nhẹ nhàng tại Khách sạn nhờ việc dịch vụ giặt khô và dịch vụ giặt là của khách sạn giữ cho quần áo của quý khách luôn sạch sẽ. Khách sạn cấm hút thuốc hoàn toàn. Chỉ được hút thuốc tại khu vực được chỉ định hạn chế.",
				"Cảm giác như ở nhà trong thời gian quý khách ở lại YUKKURI. Khách sạn cung cấp rèm che ánh sáng và dịch vụ giặt là trong một số phòng vì lợi ích của khách. Các phòng được thiết kế đặc biệt tại Khách sạn YUKKURI cung cấp lựa chọn bố trí như ban công hoặc sân hiên. Giải trí trong phòng của khách sạn không thua kém nơi đâu với truyền hình cáp và ti vi ",
				"Khách sạn cũng cung cấp tủ lạnh nhỏ chứa đồ uống và tủ lạnh trong một số phòng khi quý khách thấy cần",
				"Những khách nghỉ thích tự nấu ăn sẽ yêu thích bếp chung tại phòng. Khách sạn YUKKURI hứa hẹn mang đến cho quý khách một kỳ nghỉ vui vẻ với nhiều hoạt động và cơ sở vật chất. Những người yêu thích thể dục và muốn duy trì thói quen của mình trong kỳ nghỉ có thể ghé qua trung tâm thể dục của khách sạn. Hòa nhập xã hội phòng chờ chung và khu vực TV của khách sạn, nơi quý khách có thể gặp gỡ những vị khách khác.",
				"Hãy tận dụng cơ hội để khám phá Đà Lạt khi ở thành phố. Ga Đà Lạt nằm cách đó 2,1 km, và là một trong những điểm du lịch nổi tiếng nhất để tham quan và chụp ảnh.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
		{
			trademark: "lumina",
			url: "lumina-hotel-dalat-central",
			images: [
				"seed/Yukkuri/_DSC4432.JPG",
				"seed/Yukkuri/_DSC4437.JPG",
				"seed/Yukkuri/_DSC4454.JPG",
				"seed/Yukkuri/_DSC4467.JPG",
				"seed/Yukkuri/_DSC4472.JPG",
			],
			name: "Lumina Hotel Dalat Central",
			description: [
				"Với vị trí đắc địa ngay giữa lòng thành phố, 𝑳𝒖𝒎𝒊𝒏𝒂 𝑫𝒂𝒍𝒂𝒕 𝑯𝒐𝒕𝒆𝒍 - Nơi xuất phát lý tưởng cho mọi hành trình khám phá nơi đây.",
				"Ở Đà Lạt, nơi quá khứ vẫn vắt dòng chảy của nó vào hiện tại, màu sắc cổ xưa đan xen cùng những phát triển tân tiến, không khí hoài niệm trong nhịp sống nơi đây. Khi nhìn một hàng thông bách tán lâu năm, một con dốc đầy rêu phong hay những công trình cổ kính, hẳn là ai cũng đều cảm thấy như đang nhớ nhung một điều gì xa lắm, một điều đã qua rồi.",
				"Ẩn mình giữa trung tâm Đà Lạt thơ mộng, không thể nào thơ hơn với “chiếc” view Hồ Xuân Hương. Mỗi sáng thức dậy, ngắm nhìn mặt hồ bình yên ả phủ đầy bóng cây, màng sương mơ màng cùng hoa lá làm xiêu lòng người. Thiết kế kết hợp giữa hiện đại, mộc mạc và tinh tế. Mỗi căn phòng đều sở hữu tầm view “triệu đô” với những khoảnh khắc đắt giá của thiên nhiên: bình minh, hoàng hôn, sương mù giăng kín lối… diễn ra ngay bên ngoài khung cửa.",
				"Thư giãn spa ngay tại Lumina để xoa dịu cơ thể, thoát ra những mệt mỏi và cho bản thân đắm mình trong những trải nghiệm chưa từng có. Chiều hoàng hôn đến, thiên nhiên chiêu đãi ta bằng ánh nắng buổi chiều tà rực rỡ nhưng lại thơm nức mùi coffee. Vì chúng tôi hiểu rằng trời lạnh dần về đêm, có thể là thời gian lý tưởng để tận hưởng một tách cà phê ấm áp và thơm ngon cùng âm nhạc du dương, êm ả. Một kỳ nghỉ tuyệt vời như vậy, chắc chắn không thể bỏ qua trong cuộc đời.",
			],
			best_comforts: [],
			location: "Abc",
			province: "Đà Lạt",
			ward: "A",
		},
	];

	const data = await prisma.branch.createMany({ data: seeds, skipDuplicates: true });

	console.log(`Create ${data.count} seeds`);

	await prisma.$disconnect();
	process.exit(1);
}

main();
