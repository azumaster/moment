var page = 1,
    size = 5,
    lis = '';

(function () {
    setSize();
    getBlogList();
})();



function getBlogList(type) {
    var data = { page: page, size:size };
    if(type){
        data.type = type;
    }

    $.ajax({
        url: '/blog/list',
        type: 'get',
        data: data,
        success: function (res) {
            if(res.code == 0){
                var list = document.getElementById('blogList'),
                    blogList = res.data.blogList;
                var current = res.data.current,
                    lastPage = res.data.lastPage;

                if(current == lastPage || lastPage == 0 ){
                    document.getElementById('loading').style.display = 'none';
                } else {
                    document.getElementById('loading').style.display = 'block';
                }

                if(blogList.length <= 0){
                    lis = '<div class="left-no">' +
                        '<p>编辑大大正在连夜搬运该分类下的文章...</p>' +
                        '</div>'
                } else {
                    for(var i = 0; i< blogList.length; i++){
                        lis += '<li class="left-item">' +
                            '<div class="blog-info">' +
                            '<div class="blog-author"><img src="http://'+window.location.hostname+':10366'+blogList[i].author.head+'"><p>'+blogList[i].author.name+'</p></div>' +
                            '<div class="blog-extra">' +
                            '<p><span class="icon clock"></span><span>'+blogList[i].createdAt.split(' ')[0]+'</span></p><p><span class="icon category"></span><span>'+blogList[i].blogType+'</span></p>' +
                            '</div>' +
                            '</div><div class="blog-detail">' +
                            (blogList[i].blogCover?'<div class="blog-cover"><a href="/blog/'+blogList[i]._id+'"><img src="http://'+window.location.hostname+':10366/'+blogList[i].blogCover+'"></a></div>':'')+
                            '<div class="blog-title"><h1><a href="/blog/'+blogList[i]._id+'">'+blogList[i].blogTitle+'</a></h1>'+(blogList[i].blogDes?'<p>'+blogList[i].blogDes+'</p>':'')+'</div>' +
                            '<div class="blog-oper"><a href="/blog/'+blogList[i]._id+'">点此查看全文 <span class="icon right"></span></a></div>' +
                            '</div></li>';
                    }
                }

                list.innerHTML = lis;

            }else {

            }
        }
    });
}

// 点击加载更多
function loadMore() {
    page ++;
    getBlogList();
}

// 根据分类加载
function loadCategory(obj) {
    page = 1;
    lis = '';

    if(obj){
        getBlogList(obj.children[0].innerText);
    }else {
        getBlogList();
    }
}

// 设置最小高度
function setSize() {
    // 270
    var height = $(window).height() - 280;
    $('#pageLeft').css({minHeight: height+'px'})
}